import { Button, Box, Spinner, Text } from "@chakra-ui/react";
import { Choice } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useCheckoutStore } from "src/store/checkout";

type OptionWithoutCategoryId = Omit<Choice, "optionCategoryId">;

const SubmitOrder = () => {
  const t = trpc.useContext();
  const { paymentType, time, phoneNumber } = useCheckoutStore();
  const cartQuery = t.cart.getAll.getData();

  const { isLoading, mutate, isSuccess } = trpc.order.create.useMutation({
    onSuccess: url => {
      window.location.href = url;
    },
  });

  const handleSubmit = () => {
    if (!phoneNumber) {
      return;
    }

    if (cartQuery) {
      const orderItems = cartQuery.cart.map(item => ({
        productId: item.productId,
        price: item.product.price,
        quantity: item.quantity,
        option: item.option as OptionWithoutCategoryId[],
        total: item.total,
      }));

      mutate({
        deliverTime: time,
        grandTotal: cartQuery.grandTotal,
        paymentType,
        phoneNumber,
        products: orderItems,
      });
    }
  };

  return (
    <>
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
          <Spinner size="xl" color="crimson" mb={4} />
          <Text color={"gray.700"} fontSize="md" fontWeight={"semibold"}>
            Đang trong quá trình thanh toán... Vui lòng không tắt trình duyệt
          </Text>
        </Box>
      )}
      <Button
        position={"unset"}
        onClick={handleSubmit}
        loadingText="Đang xử lý"
        isLoading={isLoading}
        colorScheme="red"
        rounded={"md"}
      >
        Thanh toán và đặt hàng
      </Button>
    </>
  );
};

export default SubmitOrder;
