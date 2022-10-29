import { Button } from "@chakra-ui/react";
import { trpc } from "@utils/trpc";

const Order = () => {
  const { isLoading, mutate } = trpc.payment.createVNPayment.useMutation({
    onSuccess: url => {
      window.location.href = url;
    },
  });

  return (
    <Button colorScheme="red" isLoading={isLoading} onClick={() => mutate()}>
      Thanh toán
    </Button>
  );
};

export default Order;
