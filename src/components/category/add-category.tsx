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
import { InferProcedures, trpc } from "@utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type AddCategoryFields = InferProcedures["category"]["create"]["input"];

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
  } = useForm<AddCategoryFields>({ resolver: zodResolver(z.object({ title: z.string() })) });

  const addCategory: SubmitHandler<AddCategoryFields> = values => {
    mutate(values);
  };

  const isButtonDisabled = isLoading || !!errors.title;

  return (
    <>
      <Button onClick={onOpen} colorScheme="messenger" my={6}>
        Thêm danh mục
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(addCategory)}>
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
