import { useReducer } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import Link from "next/link";
import { trpc } from "src/utils/trpc";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { signIn, getProviders, ClientSafeProvider, LiteralUnion } from "next-auth/react";
import {
  Heading,
  Input,
  Button,
  FormLabel,
  Text,
  chakra,
  Box,
  FormControl,
  useToast,
  Stack,
  useColorModeValue,
  Checkbox,
  Flex,
} from "@chakra-ui/react";

import { LoginFields, loginFormValidator } from "@shared/login-form-validator";
import { zodResolver } from "@hookform/resolvers/zod";

type Providers = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=31536000, stale-while-revalidate=59");

  const providers = await getProviders();

  return {
    props: { providers },
  };
};

export default function Login(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const query = useRouter().query;

  // user http://localhost:3000/login?redirect=/user

  const redirect = typeof query.redirect === "string" ? query.redirect : `/`;

  const toast = useToast();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFields>({ resolver: zodResolver(loginFormValidator) });

  const submitHandler: SubmitHandler<LoginFields> = values => {
    console.log(values);
    toast({ title: "Success", status: "success", position: "top" });
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"3xl"}>Tham gia Coffee Data House</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            để{" "}
            <Link href={"/"}>
              <a className="text-blue-400">bàn chuyện phòng the</a>
            </Link>{" "}
            ✌️
          </Text>
        </Stack>
        {/* <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <form onSubmit={handleSubmit(submitHandler)}>
            <Stack spacing={4}>
              <FormControl id="userName" isInvalid={!!errors.userName}>
                <FormLabel>Tài khoản</FormLabel>
                <Input {...register("userName")} placeholder="Username" />
              </FormControl>
              <FormControl id="passWord" isInvalid={!!errors.passWord}>
                <FormLabel>Mật khẩu</FormLabel>
                <Input {...register("passWord")} type={"password"} placeholder="Password" />
              </FormControl>
              <Stack spacing={10}>
                <Stack direction={{ base: "column", sm: "row" }} align={"start"} justify={"space-between"}>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                  <Link href={"/"}>
                    <a className="text-blue-400">Quên mật khẩu?</a>
                  </Link>
                </Stack>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500"
                  }}

                  type="submit"
                  width="full"

                  loadingText={"Đang xử lý..."}
                >
                  Đăng nhập
                </Button>
              </Stack>

              <Box>
                Chưa có tài khoản?{" "}
                <Link href="/register">
                  <a className="text-blue-400">Đăng ký ngay</a>
                </Link>
              </Box>
            </Stack>
          </form>
        </Box> */}
        <Box>
          <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
            {Object.values(props.providers as Providers).map(provider => (
              <Box
                key={provider.id}
                py={"3"}
                cursor="pointer"
                _hover={{ bg: "#4f46e5" }}
                px={"6"}
                textColor={"gray.200"}
                fontWeight={"semibold"}
                rounded={"md"}
                bg="#1a202c"
                flex={1}
              >
                <Text onClick={() => signIn(provider.id, { callbackUrl: redirect })} textAlign={"center"}>
                  Đăng nhập bằng tài khoản Google
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Stack>
    </Flex>
  );
}
