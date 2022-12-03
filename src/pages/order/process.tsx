import { Flex } from "@chakra-ui/react";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { createContextInner } from "@server/trpc/context";
import { appRouter } from "@server/trpc/router";
import { trpc } from "@utils/trpc";
import LoadingSpinner from "@components/loading-spinner";

export const getServerSideProps: GetServerSideProps = async context => {
  const { req, res, query } = context;

  const session = await getServerAuthSession({ req, res });
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  const result = await ssg.payment.confirmPayment.fetch({ paymentData: query });

  if (result.paymentStatus === "SUCCESS") {
    return {
      redirect: {
        destination: `/order/success?orderId=${result.orderId}`,
        permanent: true,
      },
      props: {},
    };
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      query,
    },
  };
};

const Process = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { query } = props;

  const { isLoading } = trpc.payment.confirmPayment.useQuery(
    { paymentData: query },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  return (
    <Flex h={"100vh"} justifyContent="center" alignItems={"center"}>
      {isLoading && <LoadingSpinner />}
    </Flex>
  );
};

export default Process;
