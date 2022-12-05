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
  Flex,
  Text,
  Box,
  Alert,
  Button,
  useDisclosure,
  Checkbox,
} from "@chakra-ui/react";
import Image from "next/legacy/image";
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
    setValue,
    watch,
  } = useForm<CreateProductValues>({
    resolver: zodResolver(createProductValidator),
    defaultValues: {
      price: 0,
      stock: 0,
    },
  });

  const imgFile = watch().files;

  const onSubmit = handleSubmit(async values => {
    const { files, ...rest } = values;
    let image = "";
    if (imgFile && imgFile[0]) {
      image = await imgToBase64(imgFile[0]);
    }

    mutate({ ...rest, image: image });
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
              <FormControl isInvalid={!!errors.title} isRequired>
                <FormLabel>Tên sản phẩm</FormLabel>
                <Input {...register("title")} placeholder="Tên sản phẩm" />
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.categoryId} isRequired>
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
              <FormControl mt={4} isInvalid={!!errors.price} isRequired>
                <FormLabel>Giá</FormLabel>
                <Input {...register("price", { valueAsNumber: true })} placeholder="Giá tiền" />
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

              <Text fontWeight={600} mt={4} my={2}>
                Hình ảnh
              </Text>

              {imgFile && imgFile[0] ? (
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
                      {imgFile[0].name}
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
                  <Image src={URL.createObjectURL(imgFile[0])} alt={"product-image"} width={80} height={80} />
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
                  </FormLabel>
                  <Input {...register("files")} type="file" srOnly accept=".jpg, .jpeg, .png, .webp" />
                </FormControl>
              )}

              {errors.files && (
                <Alert fontSize={"sm"} fontWeight={400} my={2} px={4} py={2} rounded={"md"} status="error">
                  {errors.files.message}
                </Alert>
              )}
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
};

export default AddItem;
