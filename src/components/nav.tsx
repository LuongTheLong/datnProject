import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import NextLink from "next/link";
import { CATEGORIES } from "src/constant/categories";

const Nav = () => {
  return (
    <Box>
      <Menu autoSelect={false}>
        <MenuButton
          _hover={{
            color: "crimson",
          }}
          fontWeight={"600"}
          cursor="pointer"
          fontSize={{ base: 14, md: 15 }}
        >
          Thực đơn
        </MenuButton>
        <MenuList>
          {CATEGORIES.map(category => (
            <NextLink
              key={category.slug}
              href={{ pathname: "/[category]", query: { category: category.slug } }}
              passHref
            >
              <MenuItem
                key={category.title}
                _hover={{
                  bg: "gray.50",
                }}
              >
                {category.title}
              </MenuItem>
            </NextLink>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Nav;
