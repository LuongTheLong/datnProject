import type { NextPageWithLayout } from "@pages/_app";
import DashboardLayout from "src/layout/dashboard-layout";
import React from "react";
import Image from "next/legacy/image";
import { trpc } from "@utils/trpc";
import {
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  Button,
  HStack,
} from "@chakra-ui/react";

import LoadingSpinner from "@components/loading-spinner";
import EditProduct from "@components/products/edit";
import DeleteProduct from "@components/products/delete";
import AddProduct from "@components/products/add";
import placeholder from "../../assets/placeholder.jpg";
import { useRouter } from "next/router";
import Link from "next/link";

const Products: NextPageWithLayout = () => {
  const router = useRouter();
  const page = router.query.page ? (Number.isNaN(Number(router.query.page)) ? 1 : Number(router.query.page)) : 1;

  const { isLoading, data } = trpc.product.getAll.useQuery({ page: page }, { refetchOnWindowFocus: false });

  trpc.category.getAll.useQuery(undefined, { refetchOnWindowFocus: false });

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && data && (
        <>
          <AddProduct />

          <HStack mb={4}>
            {new Array(data.pagesNum).fill("").map((_, idx) => (
              <Link
                key={idx}
                href={{
                  pathname: router.route,
                  query: {
                    page: idx + 1,
                  },
                }}
              >
                <Button
                  borderRadius={9999}
                  width={"30px"}
                  height={"30px"}
                  colorScheme={page === idx + 1 ? "twitter" : "gray"}
                >
                  {idx + 1}
                </Button>
              </Link>
            ))}
          </HStack>

          <TableContainer overflowY={"auto"} maxHeight={"600px"}>
            <Table variant="simple">
              <Thead position={"sticky"} top={0} zIndex={99} shadow={"sm"}>
                <Tr bg={"white"}>
                  <Th>Tên</Th>
                  <Th>Hình ảnh</Th>
                  <Th>Mã sản phẩm</Th>
                  <Th>Danh mục</Th>
                  <Th>Giá</Th>
                  <Th>Mô tả</Th>
                  <Th>Hành động</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.products.map(product => (
                  <Tr key={product.title}>
                    <Td>{product.title}</Td>
                    <Td>
                      <Image
                        src={product.image || placeholder}
                        width={60}
                        height={60}
                        objectFit={"contain"}
                        alt={product.title}
                      />
                    </Td>
                    <Td>
                      <Badge colorScheme="purple">{product.code}</Badge>
                    </Td>
                    <Td>{product.category?.title}</Td>
                    <Td>{product.price}</Td>
                    <Td>{product.description ? product.description : "Không có mô tả"}</Td>
                    <Td>
                      <Flex alignItems={"center"} gap={4}>
                        <EditProduct data={product} />
                        <DeleteProduct id={product.id} />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

Products.getLayout = function getLayout(page: React.ReactElement): React.ReactNode {
  return <DashboardLayout pageInfo={{ slug: "products", title: "Danh sách sản phẩm" }}>{page}</DashboardLayout>;
};

export default Products;
