import { ReactNode } from "react";
import Logo from "../assets/logo.png";
import Image from "next/legacy/image";
import NextLink from "next/link";
import { Box, Container, SimpleGrid, Stack, Text, useColorModeValue, Icon, Flex } from "@chakra-ui/react";
import { AiOutlineFileDone, AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import { useSession } from "next-auth/react";

const MENUS = [
  { id: 2, slug: "/user", title: "Tài khoản", requiredAuth: true, icon: AiOutlineUser },
  { id: 3, slug: "/user/order", title: "Đơn hàng", requiredAuth: true, icon: AiOutlineFileDone },
];

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

export default function LargeWithLogoLeft() {
  const session = useSession();

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} color={useColorModeValue("gray.700", "gray.200")} mt={"auto"}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 1fr 1fr" }} spacing={8}>
          <Stack spacing={6}>
            <Box>
              <Image src={Logo} layout="fixed" width={100} height={100} alt="logo" />
            </Box>
            <Text fontSize={"sm"}>© {new Date().getFullYear()} Fast Food. All rights reserved</Text>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Danh sách</ListHeader>
            <NextLink href={"/"} passHref>
              <Text
                alignItems={"center"}
                _hover={{
                  textDecoration: "underline",
                }}
              >
                Trang chủ
              </Text>
            </NextLink>
            {MENUS.map(item => (
              <NextLink key={item.id} href={session.status === "authenticated" ? item.slug : "/login"} passHref>
                <Text
                  alignItems={"center"}
                  _hover={{
                    textDecoration: "underline",
                  }}
                >
                  {item.title}
                </Text>
              </NextLink>
            ))}
          </Stack>
        </SimpleGrid>
        AiOutlineHome
      </Container>
    </Box>
  );
}
