import type { NextPageWithLayout } from "@pages/_app";
import DashboardLayout from "src/layout/dashboard-layout";
import React from "react";
import { trpc } from "src/utils/trpc";
import {
  Badge,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
} from "@chakra-ui/react";

import LoadingSpinner from "@components/loading-spinner";
import EditCategory from "@components/category/edit-category";
import AddCategory from "@components/category/add-category";
import DeleteCategory from "@components/category/delete-category";

const Categories: NextPageWithLayout = () => {
  const { isLoading, data } = trpc.useQuery(["category.get-category"], {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && data && (
        <>
          <AddCategory />
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Danh mục sản phẩm</TableCaption>
              <Thead>
                <Tr>
                  <Th width={"33%"}>Tên</Th>
                  <Th width={"33%"}>Mã danh mục</Th>
                  <Th width={"33%"}>Hành động</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map(category => (
                  <Tr key={category.id}>
                    <Td>{category.name}</Td>
                    <Td>
                      <Badge colorScheme="purple">{category.codeName}</Badge>
                    </Td>
                    <Td>
                      <Flex alignItems={"center"} gap={4}>
                        <EditCategory
                          defaultValues={{
                            name: category.name,
                          }}
                          id={category.id}
                        />
                        <DeleteCategory id={category.id} />
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

Categories.getLayout = function getLayout(page: React.ReactElement): React.ReactNode {
  return <DashboardLayout>{page}</DashboardLayout>;
};

// Categories.getLayout = function getLayout(page: React.ReactElement): React.ReactNode {
//   return <LargeWithNewsletter>{page}</LargeWithNewsletter>;
// };

export default Categories;
