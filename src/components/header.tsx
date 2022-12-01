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
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import NextLink from "next/link";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { AiOutlineHome, AiOutlineUser, AiOutlineFileDone, AiOutlineExport, AiOutlineSetting } from "react-icons/ai";
import SearchBar from "./search-bar";
import Logo from "../assets/logo.png";
import SmallCart from "./small-cart";
import Nav from "./nav";

const ADMIN = ["ADMIN", "MANAGER", "WORKER"];

const SideMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const session = useSession();
  return (
    <>
      <IoMdMenu fontSize={28} onClick={onOpen} cursor={"pointer"} />
      {isOpen && (
        <Drawer placement={"left"} onClose={onClose} isOpen={isOpen} autoFocus={false}>
          <DrawerOverlay />
          <DrawerContent transition={"none"}>
            <DrawerHeader borderBottomWidth="1px">
              <NextLink href={"/"} passHref>
                <Link onClick={onClose} cursor={"pointer"}>
                  <Image src={Logo} width={80} height={80} alt={"logo"} />
                </Link>
              </NextLink>
            </DrawerHeader>
            <DrawerBody>
              <NextLink href={"/"} passHref>
                <Link onClick={onClose} _hover={{ textColor: "crimson" }}>
                  <Flex alignItems={"center"} py={3} borderBottom={"1px"} borderColor={"gray.200"}>
                    <AiOutlineHome fontSize={24} />
                    <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                      Trang chủ
                    </Text>
                  </Flex>
                </Link>
              </NextLink>
              <NextLink href={session.status === "authenticated" ? "/user" : "/login"} passHref>
                <Link onClick={onClose} _hover={{ textColor: "crimson" }}>
                  <Flex alignItems={"center"} py={3} borderBottom={"1px"} borderColor={"gray.200"}>
                    <AiOutlineUser fontSize={24} />
                    <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                      Tài khoản
                    </Text>
                  </Flex>
                </Link>
              </NextLink>

              <NextLink href={"/"} passHref>
                <Link onClick={onClose} _hover={{ textColor: "crimson" }}>
                  <Flex alignItems={"center"} py={3} borderBottom={"1px"} borderColor={"gray.200"}>
                    <AiOutlineFileDone fontSize={24} />
                    <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                      Đơn hàng
                    </Text>
                  </Flex>
                </Link>
              </NextLink>

              {ADMIN.includes(session.data?.user.role!) && (
                <NextLink href={"/dashboard"} passHref>
                  <Link onClick={onClose} _hover={{ textColor: "crimson" }}>
                    <Flex alignItems={"center"} py={3} borderBottom={"1px"} borderColor={"gray.200"}>
                      <AiOutlineSetting fontSize={24} />
                      <Text ml={2} fontSize={18} fontWeight={"semibold"}>
                        Quản lý
                      </Text>
                    </Flex>
                  </Link>
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

  const role = session.data?.user?.role || "USER";

  return (
    <Flex
      gap={16}
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
      <Box>
        <NextLink href={"/"} passHref>
          <Link cursor={"pointer"}>
            <Image src={Logo} width={90} height={90} alt="logo" />
          </Link>
        </NextLink>
      </Box>
      <Nav />
      <SearchBar />
      <Flex ml="auto" alignItems={"center"} gap={10}>
        {session.status === "authenticated" && <SmallCart />}
        {session.status === "unauthenticated" && (
          <NextLink href={"/login"}>
            <Button px={8} colorScheme="red">
              Đăng nhập
            </Button>
          </NextLink>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
