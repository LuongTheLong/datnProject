import { Flex, Text } from "@chakra-ui/react";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { createContextInner } from "@server/trpc/context";
import { appRouter } from "@server/trpc/router";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import LoadingSpinner from "@components/loading-spinner";

export const getServerSideProps: GetServerSideProps = async context => {
  const { req, res, query } = context;

  const session = await getServerAuthSession({ req, res });
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  await ssg.payment.confirmPayment.prefetch({ paymentData: query });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      query,
    },
  };
};

const Process = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { query } = props;
  const router = useRouter();

  const { isLoading } = trpc.payment.confirmPayment.useQuery(
    { paymentData: query },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: data => {
        if (data.orderId && data.paymentStatus === "SUCCESS") {
          router.push(`/order/success?orderId=${data.orderId}`);
        }
      },
    }
  );

  return (
    <Flex h={"100vh"} justifyContent="center" alignItems={"center"}>
      {isLoading && <LoadingSpinner size={12} />}
    </Flex>
  );
};

export default Process;
