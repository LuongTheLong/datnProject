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

import { createCategoryValidator } from "@shared/category-validator";
import { trpc } from "src/utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { inferMutationInput } from "src/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

type AddCategoryFields = inferMutationInput<"category.create-category">;

export default function AddCategory() {
  const client = trpc.useContext();
  const { isLoading, mutate } = trpc.useMutation(["category.create-category"], {
    onSuccess: () => {
      client.invalidateQueries("category.get-category");
      toast({ title: "Thêm danh mục thành công", status: "success", position: "top" });
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
  } = useForm<AddCategoryFields>({ resolver: zodResolver(createCategoryValidator) });

  const addMaterial: SubmitHandler<AddCategoryFields> = values => {
    mutate(values);
  };

  const isButtonDisabled = isLoading || !!errors.name;

  return (
    <>
      <Button onClick={onOpen} colorScheme="messenger" mb={6}>
        Thêm nguyên liệu
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(addMaterial)}>
          <ModalContent>
            <ModalHeader>Thêm nguyên liệu</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Tên danh mục</FormLabel>
                <Input {...register("name")} placeholder="Tên danh mục" />
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
