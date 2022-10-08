import { Button, useDisclosure } from "@chakra-ui/react";
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
} from "@chakra-ui/react";

import { trpc } from "@utils/trpc";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { InferProcedures } from "@utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

type EditCategoryFields = InferProcedures["category"]["create"]["input"];
type EditCategoryProps = {
  defaultValues: EditCategoryFields;
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
  } = useForm<EditCategoryFields>({ resolver: zodResolver(z.object({ title: z.string() })), defaultValues });

  const addMaterial: SubmitHandler<EditCategoryFields> = values => {
    mutate({ ...values, categoryId: id });
  };

  const isButtonDisabled = isLoading || !!errors.title;

  return (
    <>
      <Button size="sm" onClick={onOpen} colorScheme="messenger">
        Chỉnh sửa danh mục
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(addMaterial)}>
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
