import {
  Flex,
  useColorModeValue,
  useDisclosure,
  Box,
  Link,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";

import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoMdMenu } from "react-icons/io";
import { AiOutlineHome, AiOutlineUser, AiOutlineFileDone, AiOutlineExport } from "react-icons/ai";
import SearchBar from "./search-bar";

import Logo from "../assets/logo.png";
import SmallCart from "./small-cart";

// type NavLinks = Array<{ title: string; path: string; children?: Array<{ title: string; path: string }> }>;

// const DASHBOARD_LINKS: NavLinks = [
//   { title: "Nguyên liệu", path: "/dashboard/material" },
//   {
//     title: "Quản lý Menu",
//     path: "/dashboard/menu",
//     children: [
//       { title: "Quản lý sản phẩm", path: "/dashboard/menu/items" },
//       { title: "Quản lý danh mục", path: "/dashboard/menu/categories" },
//     ],
//   },
// ];

// const COMMON_LINKS: NavLinks = [
//   { title: "Chill", path: "/chill" },
//   { title: "Đặt bàn", path: "/booking" },
//   { title: "Đánh giá", path: "/review" },
// ];

// const COMMON_MENUS: NavLinks = [
//   { title: "Trang cá nhân", path: "/profile" },
//   { title: "Cài đặt", path: "/settings" },
// ];

// const MANAGER_MENUS: NavLinks = [
//   { title: "Trang cá nhân", path: "/profile" },
//   { title: "Quản lý", path: "/dashboard" },
//   { title: "Cài đặt", path: "/settings" },
// ];

// const MENUS = {
//   ADMIN: MANAGER_MENUS,
//   MANAGER: MANAGER_MENUS,
//   WORKER: MANAGER_MENUS,
//   USER: COMMON_MENUS,
// };

// const LINKS = {
//   ADMIN: DASHBOARD_LINKS,
//   MANAGER: DASHBOARD_LINKS,
//   WORKER: DASHBOARD_LINKS,
//   USER: COMMON_LINKS,
// };

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const session = useSession();

  const role = session.data?.user?.role || "USER";

  return (
    <>
      <Flex gap={16} px={4} py={2} alignItems={"center"}>
        <Box>
          <IoMdMenu fontSize={28} onClick={onOpen} cursor={"pointer"} />
          <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">
                <Image src={Logo} width={80} height={80} alt={"logo"} />
              </DrawerHeader>
              <DrawerBody>
                <NextLink href={"/"} passHref>
                  <Link _hover={{ textColor: "crimson" }}>
                    <Flex alignItems={"center"} py={3} borderBottom={"1px"} borderColor={"gray.200"}>
                      <AiOutlineHome fontSize={24} />
                      <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                        Trang chủ
                      </Text>
                    </Flex>
                  </Link>
                </NextLink>
                <NextLink href={"/"} passHref>
                  <Link _hover={{ textColor: "crimson" }}>
                    <Flex alignItems={"center"} py={3} borderBottom={"1px"} borderColor={"gray.200"}>
                      <AiOutlineUser fontSize={24} />
                      <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                        Tài khoản
                      </Text>
                    </Flex>
                  </Link>
                </NextLink>
                <NextLink href={"/"} passHref>
                  <Link _hover={{ textColor: "crimson" }}>
                    <Flex alignItems={"center"} py={3} borderBottom={"1px"} borderColor={"gray.200"}>
                      <AiOutlineFileDone fontSize={24} />
                      <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                        Đơn hàng
                      </Text>
                    </Flex>
                  </Link>
                </NextLink>
                <NextLink href={"/"} passHref>
                  <Link _hover={{ textColor: "crimson" }}>
                    <Flex alignItems={"center"} py={3} borderBottom={"1px"} borderColor={"gray.200"}>
                      <AiOutlineExport fontSize={24} />
                      <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                        Đăng xuất
                      </Text>
                    </Flex>
                  </Link>
                </NextLink>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
        <Box>
          <Image src={Logo} width={90} height={90} alt="logo" />
        </Box>

        <SearchBar />
        <SmallCart />
      </Flex>
    </>
  );
};

export default Header;
