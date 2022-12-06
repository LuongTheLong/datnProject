import { Flex, Heading, Box } from "@chakra-ui/react";
import Link from "next/link";

const MENUS = [
  // { id: 1, slug: "", title: "Dashboard" },
  { id: 1, slug: "order", title: "Danh sách đơn hàng" },
  { id: 2, slug: "products", title: "Danh sách sản phẩm" },
  { id: 3, slug: "categories", title: "Danh sách danh mục" },
];

const SideBar = ({
  pageInfo,
}: {
  pageInfo?: {
    title: string;
    slug: string;
  };
}) => {
  const isActive = (slug: string) => {
    return pageInfo?.slug === slug;
  };

  return (
    <Box p={4} height={"100%"}>
      <Heading as="h4" size="md" mb={4} textAlign="center">
        Trang quản lý
      </Heading>

      <Flex direction={"column"} gap={2}>
        {MENUS.map(item => (
          <Link href={`/dashboard/${item.slug}`} key={item.id}>
            <Box
              rounded={"md"}
              _hover={{
                bgColor: "gray.50",
                color: "crimson",
              }}
              px={2}
              py={3}
              alignItems={"center"}
              justifyContent="center"
              fontWeight={"semibold"}
              cursor="pointer"
              color={isActive(item.slug) ? "crimson" : "black"}
              bgColor={isActive(item.slug) ? "gray.50" : "transparent"}
              textAlign={"center"}
            >
              {item.title}
            </Box>
          </Link>
        ))}
      </Flex>
    </Box>
  );
};

export default SideBar;
