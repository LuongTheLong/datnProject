import {
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import { trpc } from "src/utils/trpc";

type DeleteProductProps = {
  id: string;
};

const DeleteItem = ({ id }: DeleteProductProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const t = trpc.useContext();

  const { isLoading, mutate } = trpc.product.delete.useMutation({
    onSuccess: () => {
      t.product.invalidate();
      toast({ position: "top", title: "Đã xóa sản phẩm", status: "success" });
      onClose();
    },
  });

  const handleDelete = () => {
    mutate({ productId: id });
  };

  return (
    <>
      <Button size={"sm"} onClick={onOpen} colorScheme="red">
        Xóa
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xóa sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>Bạn có chắc chắn muốn xóa sản phẩm này?</ModalBody>

          <ModalFooter>
            <Button
              onClick={handleDelete}
              colorScheme="red"
              mr={3}
              disabled={isLoading}
              isLoading={isLoading}
              loadingText={"Đang xử lý"}
            >
              Xóa
            </Button>
            <Button onClick={onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteItem;
