import { Flex, Text } from "@chakra-ui/react";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { createContextInner } from "@server/trpc/context";
import { appRouter } from "@server/trpc/router";
import { trpc } from "@utils/trpc";

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
    <Flex h={"100vh"} justifyContent="center" alignItems={"center"}>
      <Text fontSize={24}>
        {!isLoading && data?.paymentStatus === "SUCCESS" ? "Thanh toán hành công. Mã order: " + data.id : "Lỗi"}
      </Text>
    </Flex>
  );
};

export default Confirm;
