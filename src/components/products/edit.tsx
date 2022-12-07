import type { InferOutput } from "@utils/trpc";
import type { CreateProductValues } from "@shared/validators/product-validator";
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
  Text,
  Checkbox,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import UploadImage from "@components/upload-image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { imgToBase64 } from "@utils/common";
import { trpc } from "@utils/trpc";
import { createProductValidator } from "@shared/validators/product-validator";

type EditItemProps = { data: InferOutput["product"]["getAll"]["products"][number] };

export default function EditItem({ data }: EditItemProps) {
  const t = trpc.useContext();

  const { category, id, createdAt, image, ...rest } = data;
  const categories = t.category.getAll.getData();

  const { isLoading, mutate } = trpc.product.update.useMutation({
    onSuccess: data => {
      t.product.invalidate();
      toast({ title: "Cập nhật thành công", status: "success", position: "top" });

      if (data) {
        reset({
          file: data.image,
          categoryId: data.categoryId,
          description: data.description,
          onSale: data.onSale,
          price: data.price,
          stock: data.stock,
          title: data.title,
        });
      }

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
    control,
  } = useForm<CreateProductValues>({
    resolver: zodResolver(createProductValidator),
    defaultValues: {
      ...rest,
      file: image,
    },
  });

  const onSubmit = handleSubmit(async values => {
    const data = values;
    let image = values.file;

    if (image instanceof File) {
      image = await imgToBase64(image);
    }

    mutate({ data: { ...data, file: image }, productId: id });
  });

  const isButtonDisabled =
    isLoading || !!errors.description || !!errors.title || !!errors.price || !!errors.categoryId || !!errors.stock;

  return (
    <>
      <Button size={"sm"} onClick={onOpen} colorScheme="messenger">
        Chỉnh sửa sản phẩm
      </Button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
          }}
          isCentered
          closeOnOverlayClick={!isLoading}
          closeOnEsc={!isLoading}
        >
          <ModalOverlay />
          <form onSubmit={onSubmit}>
            <ModalContent my={0}>
              <ModalHeader>Chỉnh sửa sản phẩm</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6} maxHeight={700} overflowY={"auto"}>
                <FormControl isInvalid={!!errors.title} isDisabled={isLoading}>
                  <FormLabel>Tên sản phẩm</FormLabel>
                  <Input {...register("title")} placeholder="Tên sản phẩm" />
                </FormControl>
                <FormControl mt={4} isInvalid={!!errors.categoryId} isDisabled={isLoading}>
                  <FormLabel>Danh mục sản phẩm</FormLabel>
                  <Select placeholder="Chọn danh mục" {...register("categoryId")} defaultValue={rest.categoryId}>
                    {categories &&
                      categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                  </Select>
                </FormControl>
                <FormControl mt={4} isInvalid={!!errors.price} isDisabled={isLoading}>
                  <FormLabel>Giá</FormLabel>
                  <Input {...register("price", { valueAsNumber: true })} placeholder="Đơn vị" />
                </FormControl>
                <FormControl mt={4} isDisabled={isLoading}>
                  <FormLabel>Đang giảm giá?</FormLabel>
                  <Checkbox {...register("onSale")} placeholder="Đang giảm giá?" />
                </FormControl>
                <FormControl mt={4} isInvalid={!!errors.stock} isRequired isDisabled={isLoading}>
                  <FormLabel>Số lượng hàng tồn</FormLabel>
                  <Input {...register("stock", { valueAsNumber: true })} placeholder="Số lượng hàng tồn" />
                </FormControl>
                <FormControl mt={4} isInvalid={!!errors.description} isDisabled={isLoading}>
                  <FormLabel>Mô tả</FormLabel>
                  <Input {...register("description")} placeholder="Mô tả" />
                </FormControl>

                <Text fontWeight={600} mt={4}>
                  Hình ảnh
                </Text>
                <UploadImage control={control} isLoading={isLoading} image={image} />
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
                  Lưu thay đổi
                </Button>
                <Button onClick={onClose}>Hủy</Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </Modal>
      )}
    </>
  );
}
