import { Badge, Box, Button, Container, Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import { trpc } from "@utils/trpc";
import CommonLayout from "@layout/common-layout";
import { formatDate, formatPrice } from "@utils/common";
import { Order } from "@prisma/client";
import Link from "next/link";

type OrderProps = {
  order: Order;
};

const Order = ({ order }: OrderProps) => {
  return (
    <Box border={"1px solid rgb(231, 231, 231)"} rounded={"md"} width={"100%"}>
      <Heading as="h5" size="sm" p={4} bgColor={"rgb(247, 247, 247)"}>
        {`Đơn hàng ${order.code}`}
      </Heading>
      <Flex p={4} alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Text color="gray.600" textTransform={"capitalize"} fontWeight={"semibold"}>
            {formatDate(order.createdAt)} &#8226; {formatPrice(order.grandTotal)} VNĐ
          </Text>
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
        </Box>
        <Link
          href={{
            pathname: "/user/order/[id]",
            query: {
              id: order.id,
            },
          }}
        >
          <Button rounded={"full"} colorScheme="red">
            Xem chi tiết
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};

const OrderList = () => {
  const { isLoading, data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.order.getInfiniteUserOrders.useInfiniteQuery(
      { limit: 4 },
      { getNextPageParam: lastPage => lastPage.nextCursor }
    );

  return (
    <Container maxW="780px">
      <Box width={"100%"} my={10}>
        <Heading as="h3" size="lg" mb={4}>
          Danh sách đơn hàng
        </Heading>

        {isLoading && (
          <Flex justifyContent={"center"} my={4}>
            <Spinner size="xl" color="crimson" />
          </Flex>
        )}
        {!isLoading && data && (
          <Flex direction={"column"} gap={4} alignItems={"center"}>
            {data.pages.map(page => page.orders.map(order => <Order order={order} key={order.id} />))}
            {hasNextPage && (
              <Button
                maxW={"min-content"}
                isLoading={isFetchingNextPage}
                loadingText={"Đang xử lý"}
                colorScheme="gray"
                rounded={"full"}
                onClick={() => fetchNextPage()}
              >
                Xem thêm đơn hàng
              </Button>
            )}
          </Flex>
        )}
      </Box>
    </Container>
  );
};

OrderList.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default OrderList;
