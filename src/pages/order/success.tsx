import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { createContextInner } from "@server/trpc/context";
import { appRouter } from "@server/trpc/router";
import { trpc } from "@utils/trpc";
import popperImg from "../../assets/popper.png";
import Image from "next/legacy/image";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async context => {
  const { req, res, query } = context;

  const session = await getServerAuthSession({ req, res });
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  if (!query.orderId) {
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };
  }

  const order = await ssg.order.findById.fetch({ orderId: query.orderId as string });

  if (!order) {
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      query,
    },
  };
};

const Confirm = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { query } = props;

  const { data, isLoading } = trpc.order.findById.useQuery(
    { orderId: query.orderId as string },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  return (
    <Box h={"100vh"} w={"100%"} justifyContent="center" alignItems={"center"}>
      <Flex alignItems="center" direction={"column"} h={"100%"} mt={20}>
        <Image src={popperImg} layout={"fixed"} width={300} height={300} alt="success" />
        <Text fontSize={32} color={"green.500"} mt={10} fontWeight={"bold"}>
          {!isLoading && data?.paymentStatus === "SUCCESS" && "Thanh toán thành công."}
        </Text>

        <Text fontSize={32} color={"green.500"} mt={10} fontWeight={"bold"}>
          {!isLoading && data?.paymentType === "CASH" && "Đặt hàng thành công."}
        </Text>
        <Text fontWeight={"semibold"} fontSize={24}>
          Bạn sẽ nhận được email về chi tiết đơn hàng của mình.
        </Text>

        <HStack spacing={"24px"} mt={10}>
          <Link
            href={{
              pathname: "/user/order/[id]",
              query: {
                id: data?.id,
              },
            }}
          >
            <Button colorScheme="red">Chi tiết đơn hàng</Button>
          </Link>

          <Link href={"/"}>
            <Button colorScheme="red" variant="outline">
              Trở về trang chủ
            </Button>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Confirm;
