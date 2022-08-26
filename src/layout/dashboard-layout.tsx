import { Flex, Text } from "@chakra-ui/react";
import Header from "@components/header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DashboardLayout({ children }: { children: React.ReactNode; footer?: boolean }) {
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

  const isAuthorized =
    session.data?.user?.role === "ADMIN" ||
    session.data?.user?.role === "WORKER" ||
    session.data?.user?.role === "MANAGER";

  return (
    <>
      {isAuthorized && (
        <Flex flexDirection={"column"} minH={"100vh"}>
          <Header />
          {children}
        </Flex>
      )}

      {!isAuthorized && (
        <Text fontSize={48} fontWeight={"bold"} textAlign={"center"}>
          Không phải admin, cút
        </Text>
      )}
    </>
  );
}
