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
import { trpc } from "src/utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { inferMutationInput } from "src/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

type AddItemFields = inferMutationInput<"item.create-item">;

export default function AddItem() {
  const client = trpc.useContext();
  const categoriesQuery = client.getQueryData(["category.get-category"]);
  const { isLoading, mutate } = trpc.useMutation(["item.create-item"], {
    onSuccess: () => {
      client.invalidateQueries("item.get-item");
      toast({ title: "Thêm sản phẩm thành công", status: "success", position: "top" });
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
  } = useForm<AddItemFields>({ resolver: zodResolver(createItemValidator) });

  const addItem: SubmitHandler<AddItemFields> = values => {
    mutate(values);
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="messenger" mb={6}>
        Thêm sản phẩm
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(addItem)}>
          <ModalContent>
            <ModalHeader>Thêm sản phẩm</ModalHeader>
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
              <Button isLoading={isLoading} loadingText={"Đang lưu..."} type="submit" colorScheme="blue" mr={3}>
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
