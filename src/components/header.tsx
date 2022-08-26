import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Stack,
  Menu,
  MenuButton,
  Button,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  useDisclosure,
  Box,
  Link,
  Text,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Logo from "../assets/logoCoffee.png";

type NavLinks = Array<{ title: string; path: string; children?: Array<{ title: string; path: string }> }>;

const DASHBOARD_LINKS: NavLinks = [
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

const COMMON_LINKS: NavLinks = [
  { title: "Chill", path: "/chill" },
  { title: "Đặt bàn", path: "/booking" },
  { title: "Đánh giá", path: "/review" },
];

const COMMON_MENUS: NavLinks = [
  { title: "Trang cá nhân", path: "/profile" },
  { title: "Cài đặt", path: "/settings" },
];

const MANAGER_MENUS: NavLinks = [
  { title: "Trang cá nhân", path: "/profile" },
  { title: "Quản lý", path: "/dashboard" },
  { title: "Cài đặt", path: "/settings" },
];

const MENUS = {
  ADMIN: MANAGER_MENUS,
  MANAGER: MANAGER_MENUS,
  WORKER: MANAGER_MENUS,
  USER: COMMON_MENUS,
};

const LINKS = {
  ADMIN: DASHBOARD_LINKS,
  MANAGER: DASHBOARD_LINKS,
  WORKER: DASHBOARD_LINKS,
  USER: COMMON_LINKS,
};

const NavLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
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

const Header = () => {
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

  const role = session.data?.user?.role || "USER";

  return (
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
          <Box>
            <NextLink href={"/"}>
              <Link cursor={"pointer"}>
                {" "}
                <Image src={Logo} width={60} height={60} alt={"Logo"} />
              </Link>
            </NextLink>
          </Box>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {LINKS[role].map(link =>
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
              {MENUS[role].map(link => (
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
            {LINKS[role].map(link => (
              <NavLink key={link.title} href={link.path}>
                {link.title}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Header;
