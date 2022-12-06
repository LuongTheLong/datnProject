import DashboardLayout from "@layout/dashboard-layout";
import { NextPageWithLayout } from "@pages/_app";
import React from "react";
import { BsWallet2, BsPersonPlus } from "react-icons/bs";
import { Box, Flex, Text, Icon, Heading } from "@chakra-ui/react";

const Dashboard: NextPageWithLayout = () => {
  return (
    <Flex alignItems={"center"}>
      <Flex
        px={4}
        backgroundColor={"gray.50"}
        py={3}
        flexBasis={350}
        rounded={"md"}
        alignItems={"center"}
        border={"1px solid"}
        borderColor={"gray.200"}
      >
        <Box>
          <Heading as="h4" size="md" mb={2}>
            Doanh thu trong ngày
          </Heading>
          <Text fontWeight={"bold"} fontSize={"2xl"}>
            2,000,000 đ
          </Text>
        </Box>
        <Box ml={"auto"}>
          <Icon as={BsWallet2} w={8} h={8} />
        </Box>
      </Flex>
      <Flex p={3} flexBasis={350}>
        <Flex
          px={4}
          backgroundColor={"gray.50"}
          py={3}
          flexBasis={350}
          rounded={"md"}
          alignItems={"center"}
          border={"1px solid"}
          borderColor={"gray.200"}
        >
          <Box>
            <Heading as="h4" size="md" mb={2}>
              Số lượng thành viên
            </Heading>
            <Text fontWeight={"bold"} fontSize={"2xl"}>
              120
            </Text>
          </Box>
          <Box ml={"auto"}>
            <Icon as={BsPersonPlus} w={8} h={8} />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout pageInfo={{ slug: "", title: "Dashboard" }}>{page}</DashboardLayout>;
};

export default Dashboard;
