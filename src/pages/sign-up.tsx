import type { CreateUserFormValues } from "@shared/validators/create-user-validator";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Icon,
  useToast,
  FormErrorMessage,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { createUserValidator } from "@shared/validators/create-user-validator";
import { trpc } from "@utils/trpc";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    reset,
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserValidator),
    defaultValues: {
      name: "",
      password: "",
      username: "",
    },
  });

  const { mutate, isLoading } = trpc.user.createUser.useMutation({
    onSuccess() {
      toast({
        colorScheme: "green",
        status: "success",
        position: "top",
        title: "Đăng ký thành công.",
        duration: 2500,
        isClosable: true,
      });

      reset();
    },
    onError(error) {
      setError("username", { message: error.message });
    },
  });

  const onSubmit = handleSubmit(values => {
    mutate(values);
  });

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Đăng ký
          </Heading>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <form onSubmit={onSubmit}>
              <FormControl mb={2} id="name" isRequired isInvalid={!!errors.name} isDisabled={isLoading}>
                <FormLabel>Họ và tên</FormLabel>
                <Input {...register("name")} />

                {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
              </FormControl>

              <FormControl mb={2} id="username" isRequired isInvalid={!!errors.username} isDisabled={isLoading}>
                <FormLabel>Tên đăng nhập</FormLabel>
                <Input {...register("username")} />
                {errors.username && <FormErrorMessage>{errors.username.message}</FormErrorMessage>}
              </FormControl>
              <FormControl id="password" isRequired isInvalid={!!errors.password} isDisabled={isLoading}>
                <FormLabel>Mật khẩu</FormLabel>
                <InputGroup>
                  <Input {...register("password")} type={showPassword ? "text" : "password"} />
                  <InputRightElement h={"full"}>
                    <Button variant={"ghost"} onClick={() => setShowPassword(showPassword => !showPassword)}>
                      {showPassword ? (
                        <Icon as={AiOutlineEyeInvisible} w={6} h={6} />
                      ) : (
                        <Icon as={AiOutlineEye} w={6} h={6} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
              </FormControl>
              <Stack spacing={10} pt={2} mt={4}>
                <Button
                  loadingText="Đang xử lý"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  type="submit"
                  isLoading={isLoading}
                >
                  Đăng ký
                </Button>
              </Stack>
              <Stack pt={6}>
                <Box textAlign={"center"}>
                  Đã đăng ký?{" "}
                  <Text as={"span"} textDecoration={"underline"} color={"blue.400"}>
                    <Link href={"/login"}>Đăng nhập tại đây</Link>
                  </Text>
                </Box>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
