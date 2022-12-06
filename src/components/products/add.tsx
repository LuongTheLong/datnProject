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
  Button,
  useDisclosure,
  Checkbox,
} from "@chakra-ui/react";
import UploadImage from "@components/upload-image";
import { createProductValidator, CreateProductValues } from "@shared/validators/product-validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { imgToBase64 } from "@utils/common";
import { trpc } from "@utils/trpc";

const AddItem = () => {
  const t = trpc.useContext();
  const categories = t.category.getAll.getData();

  const { isLoading, mutate } = trpc.product.create.useMutation({
    onSuccess: () => {
      t.product.invalidate();
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
    control,
  } = useForm<CreateProductValues>({
    resolver: zodResolver(createProductValidator),
    defaultValues: {
      price: 0,
      stock: 0,
      onSale: false,
    },
  });

  const onSubmit = handleSubmit(async values => {
    const { file, ...rest } = values;
    let image = "";
    if (file instanceof File) {
      image = await imgToBase64(file);
    }

    mutate({ ...rest, file: image });
  });

  return (
    <>
      <Button onClick={onOpen} colorScheme="messenger" my={6}>
        Thêm sản phẩm
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={onSubmit}>
          <ModalContent>
            <ModalHeader>Thêm sản phẩm</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.title} isDisabled={isLoading} isRequired>
                <FormLabel>Tên sản phẩm</FormLabel>
                <Input {...register("title")} placeholder="Tên sản phẩm" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.categoryId} isDisabled={isLoading} isRequired>
                <FormLabel>Danh mục sản phẩm</FormLabel>
                <Select placeholder="Chọn danh mục" {...register("categoryId")}>
                  {categories &&
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.price} isDisabled={isLoading} isRequired>
                <FormLabel>Giá</FormLabel>
                <Input {...register("price", { valueAsNumber: true })} placeholder="Giá tiền" />
              </FormControl>
              <FormControl mt={4} isDisabled={isLoading}>
                <FormLabel>Đang giảm giá?</FormLabel>
                <Checkbox {...register("onSale")} placeholder="Đang giảm giá?" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.stock} isDisabled={isLoading} isRequired>
                <FormLabel>Số lượng hàng tồn</FormLabel>
                <Input {...register("stock", { valueAsNumber: true })} placeholder="Số lượng hàng tồn" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.description} isDisabled={isLoading}>
                <FormLabel>Mô tả</FormLabel>
                <Input {...register("description")} placeholder="Mô tả" />
              </FormControl>

              <Text fontWeight={600} mt={4} my={2}>
                Hình ảnh
              </Text>
              <UploadImage control={control} isLoading={isLoading} />
            </ModalBody>
            <ModalFooter>
              <Button isLoading={isLoading} loadingText={"Đang lưu..."} type="submit" colorScheme="blue" mr={3}>
                Lưu sản phẩm
              </Button>
              <Button onClick={onClose}>Hủy</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default AddItem;
