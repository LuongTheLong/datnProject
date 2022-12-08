import { Flex, Icon, Badge, GridItem, Box, Text, Grid } from "@chakra-ui/react";

import { formatPrice } from "@utils/common";
import { formatDate } from "@utils/common";
import { InferOutput } from "@utils/trpc";
import Image from "next/legacy/image";
import { BiTime, BiPhone } from "react-icons/bi";
import { BsCash } from "react-icons/bs";

type OrderDetailProps = {
  order: NonNullable<InferOutput["order"]["getOrderWithDetail"]>;
};

type Options = InferOutput["options"]["getByCategory"];
type Choice = Options[number]["choices"][number];

const OrderDetail = ({ order }: OrderDetailProps) => {
  return (
    <>
      <Flex mb={4} direction={"column"} gap={2}>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <Icon as={BiTime} w={6} h={6} mr={1} />
            <Text fontWeight={"semibold"}>Thời gian đặt hàng:</Text>
          </Flex>

          <Text fontWeight={"semibold"}>{formatDate(order.createdAt)}</Text>
        </Flex>

        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <Icon as={BiPhone} w={6} h={6} mr={1} />
            <Text fontWeight={"semibold"}>Số điện thoại:</Text>
          </Flex>

          <Text fontWeight={"semibold"}>{order.phoneNumber}</Text>
        </Flex>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <Icon as={BsCash} w={6} h={6} mr={1} />
            <Text fontWeight={"semibold"}>Trạng thái thanh toán</Text>
          </Flex>

          <Text fontWeight={"semibold"}>
            {order.paymentStatus === "SUCCESS" && (
              <Badge colorScheme="green" fontSize={11}>
                Đã thanh toán
              </Badge>
            )}
            {order.paymentStatus === "PENDING" && (
              <Badge colorScheme="yellow" fontSize={11}>
                Đang chờ thanh toán
              </Badge>
            )}
            {order.paymentStatus === "FAILED" && (
              <Badge colorScheme="yellow" fontSize={11}>
                Lỗi
              </Badge>
            )}
          </Text>
        </Flex>
      </Flex>

      <Box border={"1px solid rgb(231, 231, 231)"} rounded={"md"} p={4}>
        {order.orderDetail.map(detail => (
          <Grid
            justifyContent={"center"}
            alignItems={"center"}
            key={detail.id}
            h="140px"
            templateColumns="repeat(6, 1fr)"
            gap={2}
            cursor={"pointer"}
            _hover={{ bg: "gray.50" }}
            position={"relative"}
            px={2}
          >
            <GridItem display={"flex"} justifyContent="center" alignItems={"center"}>
              <Flex
                width={"35px"}
                height={"35px"}
                rounded={"full"}
                bg={"black"}
                shadow={"sm"}
                fontWeight={700}
                fontSize={16}
                justifyContent="center"
                alignItems={"center"}
                color={"white"}
                marginRight={"-17.5px"}
                position="relative"
                zIndex={2}
              >
                {detail.quantity}x
              </Flex>
              <Box position={"relative"} width={"80px"} height={"80px"} rounded={"md"} overflow={"hidden"}>
                <Image width={80} height={80} objectFit="cover" src={detail.product.image} alt={detail.product.title} />
              </Box>
            </GridItem>
            <GridItem colSpan={3}>
              <Text fontSize={16} lineHeight={1.5} fontWeight={500}>
                {detail.product.title}
              </Text>
              <Box noOfLines={2}>
                {(detail.option as Choice[]).map(option => (
                  <Text
                    _notLast={{
                      _after: {
                        content: '"•"',
                        mx: 1,
                      },
                    }}
                    key={option.id}
                    as={"span"}
                    fontSize={12}
                    color={"rgb(73, 73, 73)"}
                    fontWeight={500}
                    textTransform={"capitalize"}
                    lineHeight={0}
                  >
                    {option.title}
                  </Text>
                ))}
              </Box>
            </GridItem>
            <GridItem colSpan={2} justifySelf={"flex-end"}>
              <Text fontWeight={500} fontSize={16} color={"black"}>
                {formatPrice(detail.total)} VNĐ
              </Text>
            </GridItem>
          </Grid>
        ))}

        <Box textAlign={"right"} mt={4} px={2}>
          <Text fontWeight={"semibold"} fontSize={18}>
            Tổng: {formatPrice(order.grandTotal)} VNĐ
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default OrderDetail;
