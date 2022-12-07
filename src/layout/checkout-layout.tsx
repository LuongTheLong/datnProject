import { Flex } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import CheckoutHeader from "@components/checkout-header";

export default function CheckoutLayout({ children }: { children: React.ReactNode; footer?: boolean }) {
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      signIn();
    },
  });

  const isAuthorized = session.data?.user;

  return (
    <>
      {isAuthorized && (
        <Flex flexDirection={"column"} minH={"100vh"} px={2}>
          <CheckoutHeader />
          {children}
        </Flex>
      )}
    </>
  );
}
