import type { EditCategoryValues } from "@shared/validators/category-validator";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@utils/trpc";
import { editCategoryValidator } from "@shared/validators/category-validator";

type EditCategoryProps = {
  defaultValues: EditCategoryValues;
  id: string;
};

export default function EditCategory({ defaultValues, id }: EditCategoryProps) {
  const t = trpc.useContext();

  const { isLoading, mutate } = trpc.category.update.useMutation({
    onSuccess: () => {
      t.category.invalidate();
      toast({ title: "Sửa danh mục thành công", status: "success", position: "top" });
      reset();
      onClose();
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<EditCategoryValues>({ resolver: zodResolver(editCategoryValidator), defaultValues });

  const onSubmit = handleSubmit(values => {
    mutate({ ...values, categoryId: id });
  });

  const isButtonDisabled = isLoading || !!errors.title;

  return (
    <>
      <Button size="sm" onClick={onOpen} colorScheme="messenger">
        Chỉnh sửa danh mục
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={onSubmit}>
          <ModalContent>
            <ModalHeader>Chỉnh sửa danh mục</ModalHeader>
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
