import type { NextPageWithLayout } from "@pages/_app";
import DashboardLayout from "src/layout/dashboard-layout";
import React from "react";
import { trpc } from "src/utils/trpc";
import { Badge, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Flex } from "@chakra-ui/react";

import LoadingSpinner from "@components/loading-spinner";
import EditCategory from "@components/category/edit-category";
import AddCategory from "@components/category/add-category";
import DeleteCategory from "@components/category/delete-category";

const Categories: NextPageWithLayout = () => {
  const { isLoading, data } = trpc.category.getAll.useQuery(undefined, { refetchOnWindowFocus: false });

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && data && (
        <>
          <AddCategory />
          <TableContainer overflowY={"auto"} maxHeight={"600px"}>
            <Table variant="simple">
              <Thead position={"sticky"} top={0} zIndex={99} shadow={"sm"}>
                <Tr bg={"white"}>
                  <Th width={"33%"}>Tên</Th>
                  <Th width={"33%"}>Mã danh mục</Th>
                  <Th width={"33%"}>Hành động</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map(category => (
                  <Tr key={category.id}>
                    <Td>{category.title}</Td>
                    <Td>
                      <Badge textTransform={"lowercase"} colorScheme="purple">
                        {category.slug}
                      </Badge>
                    </Td>
                    <Td>
                      <Flex alignItems={"center"} gap={4}>
                        <EditCategory
                          defaultValues={{
                            title: category.title,
                            categoryId: category.id,
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
  return <DashboardLayout pageInfo={{ slug: "categories", title: "Danh sách danh mục" }}>{page}</DashboardLayout>;
};

export default Categories;
