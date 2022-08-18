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

import { createMaterialValidator } from "@shared/material-validator";
import { trpc } from "src/utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { inferMutationInput } from "src/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

type AddMaterialFields = inferMutationInput<"material.update">;
type DefaultValues = Omit<AddMaterialFields, "id">;

type EditMaterialProps = {
  defaultValues: DefaultValues;
  id: string;
};

export default function EditMaterial({ defaultValues, id }: EditMaterialProps) {
  const client = trpc.useContext();
  const { isLoading, mutate } = trpc.useMutation(["material.update"], {
    onSuccess: () => {
      client.invalidateQueries("material.get-all");
      toast({ title: "Cập nhật thành công", status: "success", position: "top" });
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
  } = useForm<DefaultValues>({ resolver: zodResolver(createMaterialValidator), defaultValues: defaultValues });

  const addMaterial: SubmitHandler<DefaultValues> = values => {
    mutate({ ...values, id });
  };

  const isButtonDisabled = isLoading || !!errors.count || !!errors.description || !!errors.name || !!errors.unit;

  return (
    <>
      <Button size={"sm"} onClick={onOpen} colorScheme="messenger">
        Sửa
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(addMaterial)}>
          <ModalContent>
            <ModalHeader>Chỉnh sửa nguyên liệu</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Tên nguyên liệu</FormLabel>
                <Input {...register("name")} placeholder="Tên nguyên liệu" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.count}>
                <FormLabel>Số lượng</FormLabel>
                <Input {...register("count", { valueAsNumber: true })} placeholder="Số lượng" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.unit}>
                <FormLabel>Đơn vị</FormLabel>
                <Input {...register("unit")} placeholder="Đơn vị" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.description}>
                <FormLabel>Mô tả</FormLabel>
                <Input {...register("description")} placeholder="Mô tả" />
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