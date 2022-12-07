import { GetServerSideProps } from "next";
import { BuiltInProviderType } from "next-auth/providers";

import { useRouter } from "next/router";
import { signIn, getProviders, ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Text,
  useColorModeValue,
  Divider,
  Icon,
  Heading,
  FormErrorMessage,
} from "@chakra-ui/react";
import { loginFormValidator } from "@shared/validators/login-form-validator";
import type { LoginFields } from "@shared/validators/login-form-validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import NextLink from "next/link";

type Providers = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};

export default function Login({ providers }: { providers: Providers }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFields>({
    resolver: zodResolver(loginFormValidator),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const query = useRouter().query;

  const redirect = typeof query.redirect === "string" ? query.redirect : `/`;

  const onSubmit = handleSubmit(async values => {
    setIsLoading(true);
    await signIn("credentials", {
      username: values.emailOrUsername,
      password: values.password,
      callbackUrl: "/",
    });
  });

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Đăng nhập</Heading>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <form onSubmit={onSubmit}>
            {query.error && (
              <Box px={4} py={2} bg={"rgb(255,0,0, 0.1)"} mb={4} rounded={"md"}>
                <Text color={"crimson"} fontWeight={"semibold"}>
                  {"Sai mật khẩu hoặc tài khoản"}
                </Text>
              </Box>
            )}

            <Stack spacing={4}>
              <FormControl id="emailOrUsername" isInvalid={!!errors.emailOrUsername} isDisabled={isLoading}>
                <FormLabel>Tên đăng nhập hoặc email</FormLabel>
                <Input {...register("emailOrUsername")} />
                {errors.emailOrUsername && <FormErrorMessage>{errors.emailOrUsername.message}</FormErrorMessage>}
              </FormControl>
              <FormControl id="password" isInvalid={!!errors.password} isDisabled={isLoading}>
                <FormLabel>Mật khẩu</FormLabel>
                <Input {...register("password")} type="password" />
                {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  type="submit"
                  isLoading={isLoading}
                  loadingText={"Đang xử lý..."}
                >
                  Đăng nhập
                </Button>
              </Stack>

              <Stack direction={{ base: "column", sm: "row" }} justifyContent="center">
                <NextLink href={"/sign-up"} passHref>
                  <Text as={"p"}>
                    Chưa có tài khoản?{" "}
                    <Text as="span" color={"blue.400"} _hover={{ textDecoration: "underline" }}>
                      {" "}
                      Đăng ký ngay!
                    </Text>
                  </Text>
                </NextLink>
              </Stack>
            </Stack>
          </form>

          <Box position={"relative"} my={6}>
            <Divider orientation="horizontal" />
            <Text
              position={"absolute"}
              color={"gray.500"}
              bg="white"
              px={2}
              py={1}
              top={"50%"}
              left={"50%"}
              transform={"translate(-50%, -50%)"}
            >
              hoặc
            </Text>
          </Box>

          <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
            {providers &&
              Object.values(providers).map(
                provider =>
                  provider.id === "google" && (
                    <Box
                      key={provider.id}
                      display={"flex"}
                      alignItems={"center"}
                      py={"3"}
                      cursor={!isLoading ? "pointer" : "not-allowed"}
                      _hover={{ bg: "gray.200" }}
                      px={"6"}
                      textColor={"gray.200"}
                      fontWeight={"semibold"}
                      rounded={"md"}
                      bg={"gray.50"}
                      pointerEvents={isLoading ? "none" : "auto"}
                    >
                      <Icon as={FcGoogle} w={6} h={6} mr={2} />
                      <Text
                        lineHeight={0}
                        color={"gray.600"}
                        onClick={() => signIn(provider.id, { callbackUrl: redirect })}
                        textAlign={"center"}
                      >
                        Đăng nhập với tài khoản Google
                      </Text>
                    </Box>
                  )
              )}
          </Flex>
        </Box>
      </Stack>
    </Flex>
  );
}
