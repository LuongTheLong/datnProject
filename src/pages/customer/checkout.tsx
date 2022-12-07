import type { NextPageWithLayout } from "@pages/_app";
import type { CheckoutFormValues } from "@shared/validators/checkout-validator";
import type { InferOutput } from "@utils/trpc";
import { useSession } from "next-auth/react";
import { Box, Flex, Heading, Text, Icon, useDisclosure, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { BiStoreAlt } from "react-icons/bi";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { BsCart, BsTag } from "react-icons/bs";
import { trpc } from "@utils/trpc";

import CheckoutLayout from "@layout/checkout-layout";
import CartItem from "@components/cart-item";
import OrderTime from "@components/order-time";
import PhoneNumber from "@components/phone-number";
import Payment from "@components/payment";

import LoadingSpinner from "@components/loading-spinner";

import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutValidator } from "@shared/validators/checkout-validator";

import { isStoreOpened, deliveryNowTime } from "@utils/time";
import { formatPrice } from "@utils/common";

type CartItemType = InferOutput["cart"]["getAll"]["cart"][number];
type Options = InferOutput["options"]["getByCategory"];
type Choice = Options[number]["choices"][number];

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
  const isAvailable = isStoreOpened();
  const session = useSession();
  const { control, handleSubmit } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutValidator),
    defaultValues: {
      paymentType: "VNPAY",
      deliverTime: {
        from: "",
        to: "",
      },
      orderType: isAvailable ? "NOW" : undefined,
      phoneNumber: "",
    },
  });

  const cartQuery = trpc.cart.getAll.useQuery(undefined);

  const { isLoading, mutate, isSuccess } = trpc.order.create.useMutation({
    onSuccess: url => {
      window.location.href = url;
    },
  });

  const onSubmit = handleSubmit(values => {
    const { data } = cartQuery;
    const { deliverTime, orderType, paymentType, phoneNumber } = values;

    if (data) {
      const orderItems = data.cart.map(item => ({
        productId: item.productId,
        price: item.product.price,
        quantity: item.quantity,
        option: item.option as Choice[],
        total: item.total,
      }));

      mutate({
        deliverTime: orderType === "NOW" ? deliveryNowTime() : deliverTime,
        grandTotal: data.grandTotal,
        paymentType,
        phoneNumber,
        products: orderItems,
        orderType,
      });
    }
  });

  return (
    <>
      {cartQuery.isLoading && <LoadingSpinner mt={20} />}
      {cartQuery.isSuccess && cartQuery.data.cart.length === 0 && ""}
      {cartQuery.isSuccess && cartQuery.data.cart.length > 0 && (
        <Flex direction={{ base: "column", lg: "row" }}>
          <Box flex={1} order={{ base: 2, lg: 0 }}>
            <form onSubmit={onSubmit}>
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
                  <OrderTime isStoreOpened={isAvailable} control={control} />

                  <Flex py={3} px={2} alignItems={"center"} gap={4} borderBottom={"1px solid rgb(231, 231, 231)"}>
                    <Icon as={BiStoreAlt} fontSize={24} mr={2} />
                    <Box>
                      <Text fontSize={16} color={"rgb(25, 25, 25)"} fontWeight={500}>
                        Fast Food
                      </Text>
                      <Text fontSize={14} color={"rgb(73, 73, 73)"} fontWeight={500}>
                        54 Nguyễn Lương Bằng, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng
                      </Text>
                    </Box>
                  </Flex>

                  <PhoneNumber control={control} />
                </Box>
                <Payment control={control} />

                {(isLoading || isSuccess) && (
                  <Box
                    position={"fixed"}
                    backgroundColor="rgba(0,0,0,0.2)"
                    inset={0}
                    display={"flex"}
                    justifyContent="center"
                    alignItems={"center"}
                    flexDirection="column"
                  >
                    <LoadingSpinner mb={4} mt={0} />
                    <Text color={"gray.700"} fontSize="md" fontWeight={"semibold"}>
                      Đang trong quá trình thanh toán... Vui lòng không tắt trình duyệt
                    </Text>
                  </Box>
                )}
                <Button
                  position={"unset"}
                  type={"submit"}
                  loadingText="Đang xử lý"
                  isLoading={isLoading}
                  colorScheme="red"
                  rounded={"md"}
                >
                  Thanh toán và đặt hàng
                </Button>
              </Flex>
            </form>
          </Box>
          <Box flex={{ lg: "0 0 420px", base: "unset" }} borderLeft={"1px solid rgb(231, 231, 231)"}>
            <OrderSummary cart={cartQuery.data.cart} />

            <Box borderBottom={"1px solid rgb(231, 231, 231)"} p={5}>
              <Flex alignItems={"center"} justifyContent={"space-between"} mb={2}>
                <Text fontSize={18} fontWeight={500}>
                  Giá tiền
                </Text>
                <Text fontSize={18} fontWeight={500}>
                  {formatPrice(cartQuery.data?.grandTotal)} VNĐ
                </Text>
              </Flex>
            </Box>

            <Box p={5}>
              <Flex alignItems={"center"} justifyContent={"space-between"} mb={2}>
                <Text fontSize={18} fontWeight={500}>
                  Tổng
                </Text>
                <Text fontSize={18} fontWeight={500}>
                  {formatPrice(cartQuery.data.grandTotal)} VNĐ
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
