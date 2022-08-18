import type { NextPageWithLayout } from "@pages/_app";
import DashboardLayout from "src/layout/dashboard-layout";
import React from "react";
import { trpc } from "src/utils/trpc";
import { Badge, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Flex } from "@chakra-ui/react";

import LoadingSpinner from "@components/loading-spinner";
import EditItem from "@components/items/edit";
import DeleteItem from "@components/items/delete";
import AddItem from "@components/items/add";

const Items: NextPageWithLayout = () => {
  const { isLoading, data } = trpc.useQuery(["item.get-item"], {
    refetchOnWindowFocus: false,
  });
  trpc.useQuery(["category.get-category"], { refetchOnWindowFocus: false });

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && data && (
        <>
          <AddItem />
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Danh sách sản phẩm</TableCaption>
              <Thead>
                <Tr>
                  <Th>Tên</Th>

                  <Th>Mã sản phẩm</Th>
                  <Th>Danh mục</Th>
                  <Th>Giá</Th>
                  <Th>Mô tả</Th>
                  <Th>Hành động</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map(({ category, ...item }) => (
                  <Tr key={item.id}>
                    <Td>{item.name}</Td>
                    <Td>
                      <Badge colorScheme="purple">{item.codeName}</Badge>
                    </Td>
                    <Td>{category?.name}</Td>
                    <Td>{item.price}</Td>
                    <Td>{item.description ? item.description : "Không có mô tả"}</Td>
                    <Td>
                      <Flex alignItems={"center"} gap={4}>
                        <EditItem data={item} />
                        <DeleteItem id={item.id} />
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

Items.getLayout = function getLayout(page: React.ReactElement): React.ReactNode {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Items;
