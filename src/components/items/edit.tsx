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
  Select,
} from "@chakra-ui/react";

import { createItemValidator } from "@shared/item-validator";
import { inferQueryOutput, trpc, inferMutationInput } from "src/utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type EditItemFields = inferMutationInput<"item.create-item">;
type EditItemProps = {
  data: Omit<inferQueryOutput<"item.get-item">[number], "category">;
};

export default function EditItem({ data }: EditItemProps) {
  const { id, ...rest } = data;
  const client = trpc.useContext();
  const categoriesQuery = client.getQueryData(["category.get-category"]);
  const { isLoading, mutate } = trpc.useMutation(["item.update-item"], {
    onSuccess: () => {
      client.invalidateQueries("item.get-item");
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
  } = useForm<EditItemFields>({ resolver: zodResolver(createItemValidator), defaultValues: rest });

  const addMaterial: SubmitHandler<EditItemFields> = values => {
    mutate({ ...values, id });
  };

  const isButtonDisabled = isLoading || !!errors.description || !!errors.name || !!errors.price || !!errors.idCategory;

  return (
    <>
      <Button size={"sm"} onClick={onOpen} colorScheme="messenger">
        Chỉnh sửa sản phẩm
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(addMaterial)}>
          <ModalContent>
            <ModalHeader>Chỉnh sửa sản phẩm</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Tên sản phẩm</FormLabel>
                <Input {...register("name")} placeholder="Tên sản phẩm" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.idCategory}>
                <FormLabel>Danh mục sản phẩm</FormLabel>
                <Select placeholder="Chọn danh mục" {...register("idCategory")}>
                  {categoriesQuery &&
                    categoriesQuery.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.price}>
                <FormLabel>Giá</FormLabel>
                <Input {...register("price", { valueAsNumber: true })} placeholder="Đơn vị" />
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
