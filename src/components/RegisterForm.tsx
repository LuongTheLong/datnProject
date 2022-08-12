

import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";

import {
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  FormControl,
  useToast,
  FormLabel,
  Text,
  useColorModeValue,
  HStack
} from "@chakra-ui/react";

import Link from "next/link";

import { userAPI } from "@constants/APIEndpoint";
import { RegisterFields, registerFormValidator } from "@shared/register-form-validator";

const RegisterForm = () => {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<RegisterFields>({ resolver: zodResolver(registerFormValidator) });



  const submitHandler: SubmitHandler<RegisterFields> = (values) => {
    console.log(values);
  };

  // const isButtonDisabled = isLoading || !!errors.emailAddress || !!errors.userName || !!errors.passWord;

  return (
    <>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"3xl"} textAlign={"center"}>
            Đăng ký ngay
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            để tham gia câu lạc bộ phòng the ✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <form onSubmit={handleSubmit(submitHandler)}>
            <Stack spacing={4}>
              <FormControl id="userName" isInvalid={!!errors.userName}>
                <FormLabel>Tên tài khoản</FormLabel>
                <Input {...register("userName")} placeholder="Username" />
              </FormControl>
              <HStack>
                <Box>
                  <FormControl id="surName" isInvalid={!!errors.surName}>
                    <FormLabel>Họ</FormLabel>
                    <Input {...register("surName")} type="text" placeholder="Họ" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="givenName" isInvalid={!!errors.givenName}>
                    <FormLabel>Tên</FormLabel>
                    <Input {...register("givenName")} name="givenName" type="text" placeholder="Tên" />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="emailAddress" isInvalid={!!errors.emailAddress}>
                <FormLabel>Địa chỉ email</FormLabel>
                <Input {...register("emailAddress")} type="email" placeholder="Email address" />
              </FormControl>
              <FormControl id="passWord" isInvalid={!!errors.passWord}>
                <FormLabel>Mật khẩu</FormLabel>
                <InputGroup>
                  <Input {...register("passWord")} type={"password"} placeholder="Password" />
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500"
                  }}

                  type="submit"
                  width="full"

                  loadingText={"Đang xử lý..."}
                >
                  Đăng ký
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Đã có tài khoản?{" "}
                  <Link href={"/login"}>
                    <a className="text-blue-400">Đăng nhập</a>
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </>
  );
};

export default RegisterForm;
