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
  Stack,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NextLink from "next/link";

const LINKS: Array<{ title: string; path: string; children?: Array<{ title: string; path: string }> }> = [
  { title: "Nguyên liệu", path: "/dashboard/material" },
  {
    title: "Quản lý Menu",
    path: "/dashboard/menu",
    children: [
      { title: "Quản lý sản phẩm", path: "/dashboard/menu/items" },
      { title: "Quản lý danh mục", path: "/dashboard/menu/categories" },
    ],
  },
];

const USER_LINKS = [
  { title: "Trang cá nhân", path: "/profile" },
  { title: "Quản lý", path: "/dashboard" },
  { title: "Cài đặt", path: "/settings" },
];

const NavLink = ({ children, href }: { children: ReactNode; href: string }) => (
  <NextLink href={href} passHref>
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
    >
      {children}
    </Link>
  </NextLink>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const bgColor = useColorModeValue("gray.100", "gray.900");

  const session = useSession({
    onUnauthenticated() {
      router.push({
        pathname: "/login",
        query: {
          redirect: router.pathname,
        },
      });
    },
    required: true,
  });

  return (
    <>
      {session.status === "authenticated" && (
        <>
          <Box bg={bgColor} px={4}>
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
                  {LINKS.map(link =>
                    link.children ? (
                      <Popover key={link.title} trigger={"hover"} placement={"bottom-start"}>
                        <PopoverTrigger>
                          <Link _hover={{ color: "teal.700" }}>{link.title}</Link>
                        </PopoverTrigger>
                        <PopoverContent border={0} boxShadow={"xl"} bg={"white"} p={4} rounded={"xl"} minW={"sm"}>
                          <Stack>
                            {link.children.map(subLink => (
                              <NextLink href={subLink.path} key={subLink.title} passHref>
                                <Link
                                  role={"group"}
                                  display={"block"}
                                  p={2}
                                  rounded={"md"}
                                  textDecoration={"none"}
                                  _hover={{ textColor: "teal.600" }}
                                >
                                  <Stack direction={"row"} align={"center"}>
                                    <Box>
                                      <Text transition={"all .15s ease"} fontWeight={500}>
                                        {subLink.title}
                                      </Text>
                                    </Box>
                                  </Stack>
                                </Link>
                              </NextLink>
                            ))}
                          </Stack>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <NavLink key={link.title} href={link.path}>
                        {link.title}
                      </NavLink>
                    )
                  )}
                </HStack>
              </HStack>
              <Flex alignItems={"center"}>
                <Menu>
                  <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                    <Avatar
                      size={"sm"}
                      src={
                        session.data?.user?.image ||
                        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                      }
                    />
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
              </Flex>
            </Flex>

            {isOpen ? (
              <Box pb={4} display={{ md: "none" }}>
                <Stack as={"nav"} spacing={4}>
                  {LINKS.map(link => (
                    <NavLink key={link.title} href={link.path}>
                      {link.title}
                    </NavLink>
                  ))}
                </Stack>
              </Box>
            ) : null}
          </Box>
          <Box p={4}>{children}</Box>
        </>
      )}
    </>
  );
}
