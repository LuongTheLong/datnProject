import { Button } from "@chakra-ui/react";
import { Choice } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useCheckoutStore } from "src/store/checkout";

type OptionWithoutCategoryId = Omit<Choice, "optionCategoryId">;

const SubmitOrder = () => {
  const t = trpc.useContext();
  const { paymentType, time, phoneNumber } = useCheckoutStore();
  const cartQuery = t.cart.getAll.getData();

  const { isLoading, mutate } = trpc.order.create.useMutation({
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
        productId: item.id,
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
      <Button onClick={handleSubmit} loadingText="Đang xử lý" isLoading={isLoading} colorScheme="red" rounded={"md"}>
        Thanh toán và đặt hàng
      </Button>
    </>
  );
};

export default SubmitOrder;
