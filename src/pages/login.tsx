import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { BuiltInProviderType } from "next-auth/providers";

import { useRouter } from "next/router";
import { signIn, getProviders, ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { Text, Box, Stack, useColorModeValue, Flex } from "@chakra-ui/react";

type Providers = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};

export default function Login(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const query = useRouter().query;

  const redirect = typeof query.redirect === "string" ? query.redirect : `/`;

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
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
