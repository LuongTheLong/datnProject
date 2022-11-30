import { Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CheckoutHeader from "@components/checkout-header";

export default function CheckoutLayout({ children }: { children: React.ReactNode; footer?: boolean }) {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push({
        pathname: "/login",
        query: {
          redirect: router.pathname,
        },
      });
    },
  });

  const isAuthorized = session.data?.user;

  return (
    <>
      {isAuthorized && (
        <Flex flexDirection={"column"} minH={"100vh"}>
          <CheckoutHeader />
          {children}
        </Flex>
      )}
    </>
  );
}
