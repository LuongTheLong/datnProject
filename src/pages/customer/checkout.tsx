import CheckoutLayout from "@layout/checkout-layout";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Box, Flex, Heading, Text, Icon, RadioGroup, Radio, Button, useDisclosure } from "@chakra-ui/react";
import { NextPageWithLayout } from "@pages/_app";
import { BiTimeFive, BiStoreAlt, BiRadioCircle } from "react-icons/bi";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { BsCheckCircleFill, BsTelephone, BsCart, BsTag } from "react-icons/bs";

import Image from "next/image";
import { trpc } from "@utils/trpc";
import CartItem from "@components/cart-item";
import type { CartItemType } from "@components/cart-item";
import { Spinner } from "@chakra-ui/react";

import vnpayLogo from "../../assets/vnpay.png";

const OrderSummary = ({ cart }: { cart: CartItemType[] }) => {
  const { isOpen, onToggle } = useDisclosure();

  const quantity = cart.reduce((prev, curr) => {
    return prev + curr.quantity;
  }, 0);

  return (
    <Box
      borderBottom={"1px solid rgb(231, 231, 231)"}
      p={5}
      cursor={"pointer"}
      onClick={onToggle}
      _hover={{
        bg: "rgb(247, 247, 247)",
      }}
    >
      <Flex>
        <Flex alignItems={"center"}>
          <Icon as={BsCart} fontSize={20} mr={4} />{" "}
          <Text fontSize={18} fontWeight={500}>
            {`Đơn hàng (${quantity} món)`}
          </Text>
        </Flex>
        <Icon as={isOpen ? FiChevronDown : FiChevronRight} ml={"auto"} fontSize={20} />
      </Flex>

      {isOpen && (
        <Box mt={2}>
          {cart.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </Box>
      )}
    </Box>
  );
};

const Checkout: NextPageWithLayout = () => {
  const session = useSession();
  const [total, setTotal] = useState(0);

  const cartQuery = trpc.cart.getAll.useQuery(undefined, {
    onSuccess: data => {
      setTotal(data.grandTotal);
    },
  });

  return (
    <>
      {cartQuery.isLoading && (
        <Flex justifyContent={"center"} mt={20}>
          <Spinner size="xl" color="crimson" />
        </Flex>
      )}
      {cartQuery.isSuccess && cartQuery.data.cart.length === 0 && "Mua đi rồi tính tiền"}
      {cartQuery.isSuccess && cartQuery.data.cart.length > 0 && (
        <Flex>
          <Box flex={1}>
            <Flex maxW={"640px"} mx={"auto"} direction={"column"} py={10} gap={6}>
              <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                border={"1px solid rgb(231, 231, 231)"}
                rounded={"lg"}
                p={4}
              >
                <Heading as="h5" fontSize={18}>
                  1. Địa chỉ email
                </Heading>
                <Text fontSize={16} fontWeight={500} color={"rgb(73, 73, 73)"}>
                  {session.data?.user.email}
                </Text>
              </Flex>
              <Box
                alignItems={"center"}
                justifyContent={"space-between"}
                border={"1px solid rgb(231, 231, 231)"}
                rounded={"lg"}
                p={4}
              >
                <Heading as="h5" fontSize={18} mb={4}>
                  2. Thông tin đơn hàng
                </Heading>
                <Flex py={3} px={2} gap={4}>
                  <Icon as={BiTimeFive} fontSize={24} mr={2} />
                  <Box flex={1}>
                    <Flex mb={4} alignItems={"center"} justifyContent={"space-between"} fontSize={16} fontWeight={500}>
                      <Text>Thời gian nhận hàng</Text>
                      <Text>10-20 phút</Text>
                    </Flex>

                    <Flex alignItems={"center"} gap={4}>
                      <Flex px={3} py={2} border={"2px solid black"} rounded={"lg"} gap={2} cursor={"pointer"}>
                        <Box>
                          <Text mr={2} fontSize={16} fontWeight={600}>
                            Tiêu chuẩn
                          </Text>
                          <Text fontSize={14} fontWeight={400}>
                            10-20 phút
                          </Text>
                        </Box>
                        <Icon as={BsCheckCircleFill} fontSize={16} mt={1} />
                      </Flex>

                      <Flex
                        px={3}
                        py={2}
                        border={"1px solid rgb(231, 231, 231)"}
                        rounded={"lg"}
                        gap={2}
                        cursor={"pointer"}
                      >
                        <Box>
                          <Text mr={2} fontSize={16} fontWeight={600}>
                            Đặt hẹn
                          </Text>
                          <Text fontSize={14} fontWeight={400}>
                            Chọn thời gian
                          </Text>
                        </Box>
                        <Icon as={MdOutlineRadioButtonUnchecked} fontSize={16} mt={1} />
                      </Flex>
                    </Flex>
                  </Box>
                </Flex>

                <Flex py={3} px={2} alignItems={"center"} gap={4} borderBottom={"1px solid rgb(231, 231, 231)"}>
                  <Icon as={BiStoreAlt} fontSize={24} mr={2} />
                  <Box>
                    <Text fontSize={16} color={"rgb(25, 25, 25)"} fontWeight={500}>
                      Long Food
                    </Text>
                    <Text fontSize={14} color={"rgb(73, 73, 73)"} fontWeight={500}>
                      123 Ngô Quyền, Sơn Trà, Đà Nẵng
                    </Text>
                  </Box>
                </Flex>

                <Flex py={3} px={2} alignItems={"center"} gap={4}>
                  <Icon as={BsTelephone} fontSize={24} mr={2} />

                  <Text fontSize={16} color={"rgb(25, 25, 25)"} fontWeight={500}>
                    0988663359
                  </Text>
                </Flex>
              </Box>

              <Box
                alignItems={"center"}
                justifyContent={"space-between"}
                border={"1px solid rgb(231, 231, 231)"}
                rounded={"lg"}
                p={4}
              >
                <Heading as="h5" fontSize={18} mb={4}>
                  3. Hình thức thanh toán
                </Heading>
                <Flex py={3} px={2} gap={4}>
                  <RadioGroup>
                    <Flex direction={"column"} gap={4}>
                      <Radio value="VNPAY" width={"100%"} position={"relative"}>
                        <Box ml={4}>
                          <Image src={vnpayLogo} layout={"fixed"} width={150} height={50} alt={"vnpaylogo"} />
                        </Box>
                      </Radio>

                      <Radio value="CASH">
                        <Text ml={4} fontWeight={600}>
                          Tiền mặt
                        </Text>
                      </Radio>
                    </Flex>
                  </RadioGroup>
                </Flex>
              </Box>

              <Button colorScheme="red" rounded={"md"}>
                Thanh toán và đặt hàng
              </Button>
            </Flex>
          </Box>
          <Box flex={"0 0 420px"} borderLeft={"1px solid rgb(231, 231, 231)"} height={"calc(100vh - 40px)"}>
            <OrderSummary cart={cartQuery.data.cart} />
            <Box
              borderBottom={"1px solid rgb(231, 231, 231)"}
              p={5}
              _hover={{
                bg: "rgb(247, 247, 247)",
              }}
              cursor={"pointer"}
            >
              <Flex alignItems={"center"}>
                <Icon as={BsTag} fontSize={20} mr={4} />
                <Text fontSize={18} fontWeight={500}>
                  Mã khuyến mãi
                </Text>
              </Flex>
            </Box>

            <Box borderBottom={"1px solid rgb(231, 231, 231)"} p={5}>
              <Flex alignItems={"center"} justifyContent={"space-between"} mb={2}>
                <Text fontSize={18} fontWeight={500}>
                  Giá tiền
                </Text>
                <Text fontSize={18} fontWeight={500}>
                  {cartQuery.data?.grandTotal} VNĐ
                </Text>
              </Flex>
            </Box>

            <Box p={5}>
              <Flex alignItems={"center"} justifyContent={"space-between"} mb={2}>
                <Text fontSize={18} fontWeight={500}>
                  Tổng
                </Text>
                <Text fontSize={18} fontWeight={500}>
                  {total} VNĐ
                </Text>
              </Flex>
            </Box>
          </Box>
        </Flex>
      )}
    </>
  );
};

Checkout.getLayout = function getLayout(page: React.ReactElement) {
  return <CheckoutLayout>{page}</CheckoutLayout>;
};

export default Checkout;
