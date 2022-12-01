import { Container, Heading, Box, Flex, Icon, Text, Grid, GridItem, Spinner, Badge } from "@chakra-ui/react";
import CommonLayout from "@layout/common-layout";

import { useRouter } from "next/router";
import { InferProcedures, trpc } from "@utils/trpc";
import Link from "next/link";
import { BiArrowBack, BiTime, BiPhone, BiCast } from "react-icons/bi";
import { BsCash } from "react-icons/bs";
import Image from "next/image";
import { formatDate } from "@utils/common";

type Options = InferProcedures["options"]["getByCategory"]["output"];
type Choice = Options[number]["choices"][number];

const Order = () => {
  const router = useRouter();

  const { query } = router;

  const { data, isLoading } = trpc.order.getOrderWithDetail.useQuery({ orderId: query.id as string });

  return (
    <Container maxW="780px">
      <Box width={"100%"} my={10}>
        <Link href={"/user/order"}>
          <Flex width={"max-content"} alignItems={"center"} color="crimson" cursor={"pointer"} mb={4}>
            <Icon as={BiArrowBack} fontSize={24} mr={4} />
            <Text fontSize={16} fontWeight={600}>
              Trở về danh sách đơn hàng
            </Text>
          </Flex>
        </Link>

        <Heading as="h3" size="lg" mb={4}>
          Chi tiết đơn hàng
        </Heading>

        <>
          {isLoading && (
            <Flex justifyContent={"center"} my={4}>
              <Spinner size="xl" color="crimson" />
            </Flex>
          )}
          {!isLoading && data && (
            <>
              <Flex mb={4} direction={"column"} gap={2}>
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  <Flex alignItems={"center"}>
                    <Icon as={BiTime} w={6} h={6} mr={1} />
                    <Text fontWeight={"semibold"}>Thời gian đặt hàng:</Text>
                  </Flex>

                  <Text fontWeight={"semibold"}>{formatDate(data.createdAt)}</Text>
                </Flex>

                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  <Flex alignItems={"center"}>
                    <Icon as={BiPhone} w={6} h={6} mr={1} />
                    <Text fontWeight={"semibold"}>Số điện thoại:</Text>
                  </Flex>

                  <Text fontWeight={"semibold"}>{data.phoneNumber}</Text>
                </Flex>
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  <Flex alignItems={"center"}>
                    <Icon as={BsCash} w={6} h={6} mr={1} />
                    <Text fontWeight={"semibold"}>Trạng thái thanh toán</Text>
                  </Flex>

                  <Text fontWeight={"semibold"}>
                    {data.paymentStatus === "SUCCESS" && (
                      <Badge colorScheme="green" fontSize={11}>
                        Đã thanh toán
                      </Badge>
                    )}
                    {data.paymentStatus === "PENDING" && (
                      <Badge colorScheme="yellow" fontSize={11}>
                        Đang chờ thanh toán
                      </Badge>
                    )}
                    {data.paymentStatus === "FAILED" && (
                      <Badge colorScheme="yellow" fontSize={11}>
                        Lỗi
                      </Badge>
                    )}
                  </Text>
                </Flex>
              </Flex>

              <Box border={"1px solid rgb(231, 231, 231)"} rounded={"md"} p={4}>
                {data.OrderDetail.map(detail => (
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
                        <Image
                          width={80}
                          height={80}
                          objectFit="cover"
                          src={detail.product.image}
                          alt={detail.product.title}
                        />
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
                        {detail.total} VNĐ
                      </Text>
                    </GridItem>
                  </Grid>
                ))}

                <Box textAlign={"right"} mt={4} px={2}>
                  <Text fontWeight={"semibold"} fontSize={18}>
                    Tổng: {data.grandTotal} VNĐ
                  </Text>
                </Box>
              </Box>
            </>
          )}
        </>
      </Box>
    </Container>
  );
};

Order.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Order;
