import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import NextLink from "next/link";
import { CATEGORIES } from "src/constant/categories";

const Nav = () => {
  return (
    <Menu>
      <MenuButton
        _hover={{
          color: "crimson",
        }}
        fontWeight={"600"}
        cursor="pointer"
      >
        Thực đơn
      </MenuButton>
      <MenuList>
        {CATEGORIES.map(category => (
          <MenuItem
            key={category.title}
            _hover={{
              bg: "gray.50",
            }}
          >
            <NextLink href={{ pathname: "/[category]", query: { category: category.slug } }}>{category.title}</NextLink>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default Nav;
