import RegisterForm from "@components/register-form";
import { Flex, useColorModeValue } from "@chakra-ui/react";

export default function Register() {
  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
      {" "}
      <RegisterForm />
    </Flex>
  );
}
