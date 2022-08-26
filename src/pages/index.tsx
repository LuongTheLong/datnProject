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

import { NextPageWithLayout } from "./_app";
import React from "react";
import CommonLayout from "@layout/common-layout";
import ProductGrid from "../components/main";

const Home: NextPageWithLayout = () => {
  return <ProductGrid />;
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Home;
