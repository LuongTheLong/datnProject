import { Container, Heading, Box, Flex, Icon, Text, Spinner } from "@chakra-ui/react";
import CommonLayout from "@layout/common-layout";

import { useRouter } from "next/router";
import { InferOutput, trpc } from "@utils/trpc";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

import OrderDetail from "@components/order-detail";

const Order = () => {
  const router = useRouter();

  const { query } = router;

  const { data, isLoading } = trpc.order.getOrderWithDetail.useQuery({ orderId: query.id as string });

  return (
    <Container maxW="780px">
      <Box width={"100%"} my={10}>
        <Link href={"/user/order"}>
          <Flex width={"max-content"} alignItems={"center"} color="crimson" cursor={"pointer"} mb={4}>
            <Icon as={BiArrowBack} fontSize={24} mr={4} />
            <Text fontSize={16} fontWeight={600}>
              Trở về danh sách đơn hàng
            </Text>
          </Flex>
        </Link>

        <Heading as="h3" size="lg" mb={4}>
          Chi tiết đơn hàng
        </Heading>

        <>
          {isLoading && (
            <Flex justifyContent={"center"} my={4}>
              <Spinner size="xl" color="crimson" />
            </Flex>
          )}
          {!isLoading && data && <OrderDetail order={data} />}
        </>
      </Box>
    </Container>
  );
};

Order.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Order;
