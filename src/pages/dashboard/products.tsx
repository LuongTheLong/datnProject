import type { NextPageWithLayout } from "@pages/_app";
import DashboardLayout from "src/layout/dashboard-layout";
import React from "react";
import Image from "next/image";
import { trpc } from "@utils/trpc";
import { Badge, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Flex } from "@chakra-ui/react";

import LoadingSpinner from "@components/loading-spinner";
import EditProduct from "@components/products/edit";
import DeleteProduct from "@components/products/delete";
import AddProduct from "@components/products/add";
import placeholder from "../../assets/placeholder.jpg";

const products: NextPageWithLayout = () => {
  const { isLoading, data } = trpc.product.getAll.useQuery(undefined, { refetchOnWindowFocus: false });

  trpc.category.getAll.useQuery(undefined, { refetchOnWindowFocus: false });

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && data && (
        <>
          <AddProduct />
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Danh sách sản phẩm</TableCaption>
              <Thead>
                <Tr>
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
                {data.map(product => (
                  <Tr key={product.id}>
                    <Td>{product.title}</Td>
                    <Td>
                      <Image src={product.image || placeholder} width={60} height={60} alt={product.title} />
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

products.getLayout = function getLayout(page: React.ReactElement): React.ReactNode {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default products;
