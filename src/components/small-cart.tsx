import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BiPlus, BiMinus } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import NextLink from "next/link";

const SmallCart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        onClick={onOpen}
        px={3}
        py={2}
        rounded={"full"}
        alignItems="center"
        bg={"crimson"}
        gap={4}
        cursor="pointer"
        _hover={{ bg: "#ba0f31" }}
        visibility={isOpen ? "hidden" : "visible"}
      >
        <FaShoppingCart fontSize={18} color={"white"} />
        <Text lineHeight={0} fontWeight={"medium"} color={"white"} fontSize={18}>
          0
        </Text>
      </Flex>
      <Drawer placement={"right"} onClose={onClose} isOpen={isOpen} size={"sm"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" fontSize={24}>
            Giỏ hàng
            <Button bg={"crimson"} _hover={{ bg: "#ba0f31" }} rounded={"full"} width={"full"} mt={4}>
              <Flex alignItems={"center"} justifyContent="space-between" width={"full"}>
                <Text color={"white"} fontWeight={700}>
                  Thanh toán
                </Text>
                <Text color={"white"} fontWeight={700}>
                  20.000 VNĐ
                </Text>
              </Flex>
            </Button>
          </DrawerHeader>
          <DrawerBody>
            <Flex
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={2}
              py={3}
              borderBottom={"1px"}
              borderColor={"gray.200"}
            >
              <Box>
                <Text mb={2} fontWeight="500">
                  Bánh mì kẹp Long
                </Text>
                <Text fontSize={14} fontWeight={500}>
                  20.000 VNĐ
                </Text>
              </Box>
              <HStack boxShadow={"rgb(0 0 0 / 20%) 0px 2px 8px"} rounded={"full"} overflow="hidden" bg={"white"}>
                <Box>
                  <IconButton
                    bg={"transparent"}
                    rounded="none"
                    size="sm"
                    aria-label="Search database"
                    icon={<BiMinus fontSize={20} />}
                    _hover={{ color: "crimson", bg: "transparent" }}
                  />
                </Box>
                <Box>
                  <Text fontWeight={"medium"}>2</Text>
                </Box>
                <Box>
                  <IconButton
                    bg={"transparent"}
                    rounded="none"
                    size="sm"
                    aria-label="Search database"
                    icon={<BiPlus fontSize={20} />}
                    _hover={{ color: "crimson", bg: "transparent" }}
                  />
                </Box>
              </HStack>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SmallCart;
