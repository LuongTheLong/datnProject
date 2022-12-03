import type { InferProcedures } from "@utils/trpc";
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
  Alert,
  Box,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import NextImage from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { imgToBase64 } from "@utils/common";
import { trpc } from "@utils/trpc";
import { createProductValidator } from "@shared/validators/product-validator";

type EditItemProps = { data: InferProcedures["product"]["getAll"]["output"]["products"][number] };

export default function EditItem({ data }: EditItemProps) {
  const t = trpc.useContext();

  const { category, id, createdAt, ...rest } = data;
  const categories = t.category.getAll.getData();

  const { isLoading, mutate } = trpc.product.update.useMutation({
    onSuccess: () => {
      t.product.invalidate();
      toast({ title: "Cập nhật thành công", status: "success", position: "top" });
      reset();
      onClose();
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [editImage, setEditImage] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateProductValues>({
    resolver: zodResolver(createProductValidator),
    defaultValues: rest,
  });

  const files = watch().files;

  const onSubmit = handleSubmit(async values => {
    const data = values;
    let image = data.image;

    if (editImage && files && files[0]) {
      image = await imgToBase64(files[0]);
    }

    mutate({ data: { ...data, image }, productId: id });
  });

  const isButtonDisabled =
    isLoading || !!errors.description || !!errors.title || !!errors.price || !!errors.categoryId || !!errors.stock;

  return (
    <>
      <Button size={"sm"} onClick={onOpen} colorScheme="messenger">
        Chỉnh sửa sản phẩm
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          reset();
        }}
        isCentered
      >
        <ModalOverlay />
        <form onSubmit={onSubmit}>
          <ModalContent my={0}>
            <ModalHeader>Chỉnh sửa sản phẩm</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Tên sản phẩm</FormLabel>
                <Input {...register("title")} placeholder="Tên sản phẩm" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.categoryId}>
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
              <FormControl mt={4} isInvalid={!!errors.price}>
                <FormLabel>Giá</FormLabel>
                <Input {...register("price", { valueAsNumber: true })} placeholder="Đơn vị" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Đang giảm giá?</FormLabel>
                <Checkbox {...register("onSale")} placeholder="Đang giảm giá?" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.stock} isRequired>
                <FormLabel>Số lượng hàng tồn</FormLabel>
                <Input {...register("stock", { valueAsNumber: true })} placeholder="Số lượng hàng tồn" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.description}>
                <FormLabel>Mô tả</FormLabel>
                <Input {...register("description")} placeholder="Mô tả" />
              </FormControl>

              <Flex alignItems={"center"} mt={4} my={2}>
                <Text fontWeight={600}>Hình ảnh</Text>

                <Text ml={"auto"} cursor={"pointer"} color="gray.400" onClick={() => setEditImage(prev => !prev)}>
                  Chỉnh sửa
                </Text>
              </Flex>

              {editImage ? (
                files && files[0] ? (
                  <Flex flexDir={"column"} alignItems={"center"}>
                    <Flex
                      p={2}
                      bg={"gray.100"}
                      rounded={"md"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={6}
                      my={2}
                      width={"full"}
                    >
                      <Text fontSize={14} noOfLines={1}>
                        {files[0].name}
                      </Text>{" "}
                      <Button
                        size={"sm"}
                        colorScheme="red"
                        onClick={() => {
                          setValue("files", undefined), reset({ files: undefined });
                        }}
                      >
                        Xóa
                      </Button>
                    </Flex>
                    <NextImage
                      objectFit="contain"
                      src={URL.createObjectURL(files[0])}
                      alt={"product-image"}
                      width={250}
                      height={200}
                    />
                  </Flex>
                ) : (
                  <FormControl mt={4} isInvalid={!!errors.files}>
                    <FormLabel
                      onDrop={event => {
                        event.preventDefault();
                        setValue("files", event.dataTransfer.files);
                      }}
                      onDragOver={event => event.preventDefault()}
                      m={0}
                    >
                      <Flex
                        justifyContent={"center"}
                        alignItems="center"
                        p={6}
                        border={1}
                        borderColor={"gray.400"}
                        borderStyle={"dashed"}
                        rounded={"md"}
                        cursor={"pointer"}
                        mt={2}
                      >
                        <Box>
                          <Text fontSize={15} mb={1} fontWeight={"medium"} textAlign={"center"} color={"gray.500"}>
                            Ấn vào hoặc kéo thả hình
                          </Text>

                          <Text fontSize={12} fontWeight={"medium"} textAlign={"center"}>
                            PNG, JPEG, JPG, WEBP (1MB)
                          </Text>
                        </Box>
                      </Flex>
                      <Input {...register("files")} type="file" srOnly accept=".jpg, .jpeg, .png, .webp" />
                    </FormLabel>

                    {errors.files && (
                      <Alert fontSize={"sm"} fontWeight={400} my={2} px={4} py={2} rounded={"md"} status="error">
                        {errors.files.message}
                      </Alert>
                    )}
                  </FormControl>
                )
              ) : (
                <Flex justifyContent={"center"}>
                  <NextImage objectFit="contain" src={data.image!} alt={"product-image"} width={250} height={200} />
                </Flex>
              )}
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
