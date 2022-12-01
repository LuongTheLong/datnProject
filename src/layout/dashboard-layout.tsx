import { Flex, Text, Container, Box } from "@chakra-ui/react";
import DashboardHeader from "@components/dashboard/header";
import SideBar from "@components/dashboard/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DashboardLayout({
  children,
  pageInfo,
}: {
  children: React.ReactNode;
  footer?: boolean;
  pageInfo?: {
    title: string;
    slug: string;
  };
}) {
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
      {session.status === "authenticated" && isAuthorized && (
        <Flex h={"100vh"} gap={4} p={4} backgroundColor={"gray.50"}>
          <Box
            rounded={"lg"}
            flexBasis={"260px"}
            flexShrink={0}
            flexGrow={0}
            bg={"white"}
            border={"1px solid"}
            borderColor={"gray.100"}
            height={"100%"}
          >
            <SideBar pageInfo={pageInfo} />
          </Box>

          <Box
            rounded={"lg"}
            flex={1}
            border={"1px solid"}
            borderColor={"gray.100"}
            backgroundColor={"white"}
            px={5}
            py={4}
            height={"100%"}
          >
            <DashboardHeader title={pageInfo?.title} />
            {children}
          </Box>
        </Flex>
      )}

      {session.status !== "loading" && !isAuthorized && (
        <Text fontSize={48} fontWeight={"bold"} textAlign={"center"}>
          Lỗi
        </Text>
      )}
    </>
  );
}
