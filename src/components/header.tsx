import {
  Flex,
  useDisclosure,
  Box,
  Link,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import NextLink from "next/link";
import Image from "next/legacy/image";
import { IoMdMenu } from "react-icons/io";
import { AiOutlineHome, AiOutlineUser, AiOutlineFileDone, AiOutlineExport, AiOutlineSetting } from "react-icons/ai";

import SearchBar from "./search-bar";
import SmallCart from "./small-cart";
import Nav from "./nav";
import Logo from "../assets/logo.png";
import MobileSearchBar from "./mobile-search-bar";

const MENUS = [
  { id: 2, slug: "/user", title: "Tài khoản", requiredAuth: true, icon: AiOutlineUser },
  { id: 3, slug: "/user/order", title: "Đơn hàng", requiredAuth: true, icon: AiOutlineFileDone },
];

const SideMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const session = useSession();

  const isAdmin =
    session.data?.user.role! === "ADMIN" ||
    session.data?.user.role! === "MANAGER" ||
    session.data?.user.role! === "WORKER";

  return (
    <>
      <IoMdMenu fontSize={28} onClick={onOpen} cursor={"pointer"} />
      {isOpen && (
        <Drawer placement={"left"} onClose={onClose} isOpen={isOpen} autoFocus={false}>
          <DrawerOverlay />
          <DrawerContent transition={"none"}>
            <DrawerHeader borderBottomWidth="1px">
              <NextLink onClick={onClose} href={"/"} passHref>
                <Box cursor={"pointer"}>
                  <Image src={Logo} width={80} height={80} alt={"logo"} />
                </Box>
              </NextLink>
            </DrawerHeader>
            <DrawerBody>
              <NextLink href={"/"} onClick={onClose} passHref>
                <Flex
                  alignItems={"center"}
                  py={3}
                  borderBottom={"1px"}
                  borderColor={"gray.200"}
                  _hover={{ textColor: "crimson" }}
                >
                  <AiOutlineHome fontSize={24} />
                  <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                    Trang chủ
                  </Text>
                </Flex>
              </NextLink>

              {session.status === "authenticated" &&
                MENUS.map(item => (
                  <NextLink href={item.slug} onClick={onClose} key={item.id} passHref>
                    <Flex
                      _hover={{ textColor: "crimson" }}
                      alignItems={"center"}
                      py={3}
                      borderBottom={"1px"}
                      borderColor={"gray.200"}
                    >
                      <Icon as={item.icon} w={6} h={6} />

                      <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                        {item.title}
                      </Text>
                    </Flex>
                  </NextLink>
                ))}

              {isAdmin && (
                <NextLink href={"/dashboard/order"} onClick={onClose} passHref>
                  <Flex
                    _hover={{ textColor: "crimson" }}
                    alignItems={"center"}
                    py={3}
                    borderBottom={"1px"}
                    borderColor={"gray.200"}
                  >
                    <AiOutlineSetting fontSize={24} />
                    <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                      Quản lý
                    </Text>
                  </Flex>
                </NextLink>
              )}
              {session.status === "authenticated" && (
                <Flex
                  onClick={() => signOut()}
                  alignItems={"center"}
                  _hover={{ textColor: "crimson" }}
                  py={3}
                  borderBottom={"1px"}
                  borderColor={"gray.200"}
                  cursor={"pointer"}
                >
                  <AiOutlineExport fontSize={24} />
                  <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                    Đăng xuất
                  </Text>
                </Flex>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

const Header = () => {
  const session = useSession();

  return (
    <Flex
      gap={{ base: 6, md: 16 }}
      px={4}
      py={2}
      alignItems={"center"}
      position={"sticky"}
      zIndex={2}
      top={0}
      bg={"white"}
      shadow={"md"}
    >
      <Box>
        <SideMenu />
      </Box>
      <Box display={{ base: "none" }}>
        <NextLink href={"/"} style={{ cursor: "pointer" }} passHref>
          <Image src={Logo} width={90} height={90} alt="logo" />
        </NextLink>
      </Box>
      <Nav />
      <Box display={{ base: "none", md: "block" }}>
        <SearchBar />
      </Box>

      <Box display={{ base: "block", md: "none" }}>
        <MobileSearchBar />
      </Box>

      <Flex ml="auto" alignItems={"center"} gap={10}>
        {session.status === "authenticated" && <SmallCart />}
        {session.status === "unauthenticated" && (
          <Button px={8} onClick={() => signIn()} colorScheme="red">
            Đăng nhập
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
