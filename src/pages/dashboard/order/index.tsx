import {
  Avatar,
  Badge,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Text,
  Box,
  Spinner,
  TableContainer,
  HStack,
} from "@chakra-ui/react";
import DashboardLayout from "@layout/dashboard-layout";
import { formatDate } from "@utils/common";
import { trpc } from "@utils/trpc";
import EditOrder from "@components/dashboard-order/edit";
import ViewOrder from "@components/dashboard-order/view";

const captions = ["Mã đơn hàng", "Hình thức thanh toán", "Trạng thái thanh toán", "Thời gian đặt hàng", "Thao tác"];

const DashboardOrders = () => {
  const textColor = useColorModeValue("gray.700", "white");

  const { isLoading, data } = trpc.order.getAllOrders.useQuery(undefined);

  return (
    <Box px={5} py={4}>
      {isLoading && (
        <Flex justifyContent={"center"} my={2}>
          <Spinner color="crimson" size="xl" />
        </Flex>
      )}

      {!isLoading && data && (
        <TableContainer overflowY={"scroll"} maxHeight={"580px"}>
          <Table variant="simple" color={textColor}>
            <Thead position={"sticky"} top={0} bg={"gray.50"}>
              <Tr my=".8rem" pl="0px" color="gray.400">
                {captions.map((caption, idx) => {
                  return (
                    <Th color="gray.400" key={idx}>
                      {caption}
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody overflow={"auto"}>
              {data.map(order => (
                <Tr key={order.id}>
                  <Td minWidth={{ sm: "250px" }} pl="0px">
                    <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                      <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                        {order.code}
                      </Text>
                    </Flex>
                  </Td>

                  <Td>
                    <Text fontSize="sm" fontWeight={"semibold"} color="gray.400">
                      {order.paymentType}
                    </Text>
                  </Td>
                  <Td>
                    {order.paymentStatus === "SUCCESS" && (
                      <Badge colorScheme="green" fontSize={11}>
                        Đã thanh toán
                      </Badge>
                    )}
                    {order.paymentStatus === "PENDING" && (
                      <Badge colorScheme="yellow" fontSize={11}>
                        Đang chờ thanh toán
                      </Badge>
                    )}
                    {order.paymentStatus === "FAILED" && (
                      <Badge colorScheme="yellow" fontSize={11}>
                        Lỗi
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
                      {formatDate(order.createdAt)}
                    </Text>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <EditOrder order={order} />
                      <ViewOrder orderId={order.id} />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

DashboardOrders.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout pageInfo={{ slug: "order", title: "Danh sách đơn hàng" }}>{page}</DashboardLayout>;
};

export default DashboardOrders;
