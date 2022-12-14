import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { Order, PAYMENTSTATUS } from "@prisma/client";
import { useForm } from "react-hook-form";
import { EditOrderValidator } from "@shared/validators/edit-order-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EditOrderFormValues } from "@shared/validators/edit-order-validator";
import { trpc } from "@utils/trpc";

const PAYMENT_STATUS: { title: string; code: PAYMENTSTATUS }[] = [
  { code: "FAILED", title: "Thất bại" },
  { code: "SUCCESS", title: "Thành công" },
  { code: "PENDING", title: "Đang chờ thanh toán" },
];

type EditOrderProps = {
  order: Order;
};

const EditOrder = ({ order }: EditOrderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const t = trpc.useContext();
  const { isLoading, mutate } = trpc.order.update.useMutation({
    onSuccess: data => {
      t.order.getAllOrders.invalidate();
      toast({
        colorScheme: "green",
        status: "success",
        title: "Cập nhật thành công",
        position: "top",
      });
      reset({
        paymentStatus: data.paymentStatus,
      });
      onClose();
    },
  });

  const { reset, handleSubmit, register } = useForm<EditOrderFormValues>({
    resolver: zodResolver(EditOrderValidator),
    defaultValues: {
      paymentStatus: order.paymentStatus,
    },
  });

  const onSubmit = handleSubmit(values => {
    mutate({ ...values, orderId: order.id });
  });

  return (
    <>
      <Button colorScheme={"blue"} onClick={onOpen}>
        Chỉnh sửa
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isLoading}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={onSubmit}>
            <ModalHeader>Chỉnh sửa trạng thái đơn hàng</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mt={4} isDisabled={isLoading}>
                <FormLabel>Trạng thái thanh toán</FormLabel>
                <Select placeholder="Chọn danh mục" {...register("paymentStatus")}>
                  {PAYMENT_STATUS.map(status => (
                    <option key={status.code} value={status.code}>
                      {status.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} loadingText={"Đang xử lý"} isLoading={isLoading} type={"submit"}>
                Lưu
              </Button>
              <Button onClick={onClose} variant="ghost" isDisabled={isLoading}>
                Close
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditOrder;
