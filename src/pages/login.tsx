import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import Link from "next/link";

import { useRouter } from "next/router";
import { signIn, getProviders, ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { Heading, Text, Box, Stack, useColorModeValue, Flex } from "@chakra-ui/react";

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

  const redirect = typeof query.redirect === "string" ? query.redirect : `/`;

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
