import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createCategoryValidator } from "@shared/validators/category-validator";
import type { CreateCategoryValues } from "@shared/validators/category-validator";

export default function AddCategory() {
  const t = trpc.useContext();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading, mutate } = trpc.category.create.useMutation({
    onSuccess: () => {
      t.category.invalidate();
      toast({ title: "Thêm danh mục thành công", status: "success", position: "top" });
      reset();
      onClose();
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CreateCategoryValues>({ resolver: zodResolver(createCategoryValidator) });

  const onSubmit = handleSubmit(values => {
    mutate(values);
  });

  const isButtonDisabled = isLoading || !!errors.title;

  return (
    <>
      <Button onClick={onOpen} colorScheme="messenger" my={6}>
        Thêm danh mục
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={onSubmit}>
          <ModalContent>
            <ModalHeader>Thêm danh mục</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Tên danh mục</FormLabel>
                <Input {...register("title")} placeholder="Tên danh mục" />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                isDisabled={isButtonDisabled}
                isLoading={isLoading}
                loadingText={"Đang lưu..."}
                type="submit"
                colorScheme="blue"
                mr={3}
              >
                Lưu
              </Button>
              <Button onClick={onClose}>Hủy</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
