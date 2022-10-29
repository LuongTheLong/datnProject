import { Button } from "@chakra-ui/react";
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

  await ssg.payment.confirmPayment.prefetch({ paymentData: query });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      query,
    },
  };
};

const Confirm = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { query } = props;

  const { data, isLoading } = trpc.payment.confirmPayment.useQuery(
    { paymentData: query },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Button colorScheme="red" isLoading={isLoading} loadingText={"Đang xử lý"}>
      {!isLoading && data?.paymentStatus === "success" ? "Thành công" : "Thất bại"}
    </Button>
  );
};

export default Confirm;
