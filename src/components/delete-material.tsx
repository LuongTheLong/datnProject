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

type DeleteMaterialProps = {
  id: string;
};

const DeleteMaterial = ({ id }: DeleteMaterialProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const client = trpc.useContext();

  const { isLoading, mutate } = trpc.useMutation(["material.delete"], {
    onSuccess: () => {
      client.invalidateQueries("material.get-all");
      toast({ position: "top", title: "Đã xóa nguyên liệu", status: "success" });
      onClose();
    },
  });

  const handleDelete = () => {
    mutate({ id });
  };

  return (
    <>
      <Button size={"sm"} onClick={onOpen} colorScheme="red">
        Xóa
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xóa nguyên liệu</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>Bạn có chắc chắn muốn xóa nguyên liệu này?</ModalBody>

          <ModalFooter>
            <Button
              onClick={handleDelete}
              colorScheme="red"
              mr={3}
              disabled={isLoading}
              isLoading={isLoading}
              loadingText={"Đang xử lý"}
            >
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteMaterial;
