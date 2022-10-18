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
  Radio,
  RadioGroup,
  Input
} from "@chakra-ui/react";


import { useState } from "react";
import { BiPlus, BiMinus } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import NextLink from "next/link";
import { date } from "zod";

const SmallCart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState('inside');

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
            <Text mb={2} fontWeight="700">
              Chọn phương thức đặt:
            </Text>
            <RadioGroup onChange={setValue} value={value}>
              <HStack direction='row'>
                <Radio value='take-away'>Mang đi</Radio>
                <Radio value='inside' defaultChecked>Tại chỗ</Radio>
              </HStack>
            </RadioGroup>
            <Text mb={2} fontWeight="700">
              Chọn thời gian nhận:
            </Text>
            <Input
              placeholder="Chọn thời gian nhận"
              size="md"
              type="time"
              min={Date.now()}
              required
            />
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
