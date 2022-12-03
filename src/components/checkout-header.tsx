import { Flex, Icon, Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

const CheckoutHeader = () => {
  return (
    <Box p={4} borderBottom={"1px solid rgb(231, 231, 231)"}>
      <Link href={"/"}>
        <Flex alignItems={"center"} color="crimson" cursor={"pointer"} maxW={"max-content"}>
          <Icon as={BiArrowBack} fontSize={24} mr={4} />
          <Text fontSize={16} fontWeight={600}>
            Trở về
          </Text>
        </Flex>
      </Link>
    </Box>
  );
};

export default CheckoutHeader;
