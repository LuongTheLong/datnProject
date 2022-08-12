import { ReactNode } from "react";
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
  Stack
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Links = ["Chill", "Booking", "Review"];

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
            <Box>Logo</Box>
            <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
              {Links.map((link) => (
                <Link href={link} key={link}>
                  <a className="px-2 hover:text-teal-700">{link}</a>
                </Link>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {
              session.data?.user ? <Menu> <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                <Avatar
                  size={"sm"}
                  src={session.data.user?.image as string}
                />
              </MenuButton> <MenuList>
                  <MenuItem>Trang cá nhân</MenuItem>
                  <MenuItem>Quản lý</MenuItem>
                  <MenuItem>Cài đặt</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => signOut({ callbackUrl: "/" })}>Đăng xuất</MenuItem>
                </MenuList>
              </Menu> : <Link href="/login" passHref>
                <Button variant={"solid"} colorScheme={"teal"} size={"sm"} mr={4}>
                  Đăng nhập
                </Button>
              </Link>
            }


          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <Link href={link} key={link}>
                  <a className="px-2 hover:text-teal-700">{link}</a>
                </Link>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>Main Content Here</Box>
    </>
  );
}
