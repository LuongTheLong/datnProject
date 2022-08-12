import type { NextPageWithLayout } from "@pages/_app";
import DashboardLayout from "src/layout/dashboard-layout";
import React from "react";
import { trpc } from "src/utils/trpc";
import { Badge } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

import LoadingSpinner from "@components/loading-spinner";
import AddMaterial from "@components/add-material";

import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";

const Material: NextPageWithLayout = () => {
  const { isLoading, data } = trpc.useQuery(["material.get-material", {}], {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && data && (
        <>
          <AddMaterial />
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Danh sách nguyên liệu hiện có trong cửa hàng</TableCaption>
              <Thead>
                <Tr>
                  <Th>Tên</Th>
                  <Th>Mã nguyên liệu</Th>
                  <Th>Số lượng</Th>
                  <Th>Đơn vị</Th>
                  <Th>Mô tả</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map(material => (
                  <Tr key={material.id}>
                    <Td>{material.name}</Td>
                    <Td>
                      <Badge colorScheme="purple">{material.codeName}</Badge>
                    </Td>
                    <Td>{material.count}</Td>
                    <Td>{material.unit}</Td>
                    <Td>{material.description}</Td>
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

Material.getLayout = function getLayout(page: React.ReactElement): React.ReactNode {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Material;
