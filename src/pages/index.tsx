import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Link,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Logo from "../assets/logoCoffee.png";
import GridListWithHeading from '../pages/main';
import LargeWithNewsletter from '../pages/footer';

const LINKS = [
  { title: "Chill", path: "/chill" },
  { title: "Đặt bàn", path: "/booking" },
  { title: "Đánh giá", path: "/review" },
];

const USER_LINKS = [
  { title: "Trang cá nhân", path: "/profile" },
  { title: "Quản lý", path: "/dashboard" },
  { title: "Cài đặt", path: "/settings" },
];

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const session = useSession();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <NextLink href={"/"} passHref>
                <Link cursor={"pointer"}>
                  <Image src={Logo} width={60} height={60} alt={"Logo"} />
                </Link>
              </NextLink>
            </Box>
            <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
              {LINKS.map(link => (
                <NextLink href={link.path} key={link.title} passHref>
                  <Link px={2} _hover={{ color: "teal.700" }}>
                    {link.title}
                  </Link>
                </NextLink>
              ))}
            </HStack>
          </HStack>
          {session.status !== "loading" && (
            <Flex alignItems={"center"}>
              {session.data?.user ? (
                <Menu>
                  <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                    <Avatar size={"sm"} src={session.data.user?.image as string} />
                  </MenuButton>
                  <MenuList>
                    {USER_LINKS.map(link => (
                      <NextLink href={link.path} key={link.title} passHref>
                        <Link _hover={{ color: "teal.700" }}>
                          <MenuItem>{link.title}</MenuItem>
                        </Link>
                      </NextLink>
                    ))}
                    <MenuDivider />
                    <MenuItem onClick={() => signOut({ callbackUrl: "/" })}>Đăng xuất</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <NextLink href="/login" passHref>
                  <Button variant={"solid"} colorScheme={"teal"} size={"sm"} mr={4}>
                    Đăng nhập
                  </Button>
                </NextLink>
              )}
            </Flex>
          )}
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {USER_LINKS.map(link => (
                <NextLink href={link.path} key={link.title} passHref>
                  <Link px={2} _hover={{ color: "teal.700" }}>
                    {link.title}
                  </Link>
                </NextLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <GridListWithHeading />
      <LargeWithNewsletter />
    </>
  );
}
