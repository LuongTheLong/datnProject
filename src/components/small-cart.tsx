import { Flex, Text } from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";

const SmallCart = () => {
  return (
    <Flex px={3} py={2} rounded={"full"} alignItems="center" bg={"crimson"} gap={4}>
      <FaShoppingCart fontSize={18} color={"white"} />
      <Text lineHeight={0} fontWeight={"medium"} color={"white"} fontSize={18}>
        0
      </Text>
    </Flex>
  );
};

export default SmallCart;
