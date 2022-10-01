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
  Flex,
  Text,
  Box,
  Alert,
  Input,
  useToast,
  Select,
} from "@chakra-ui/react";

import Image from "next/image";
import { createItemValidatorWithFile, ItemValidatorWithFile } from "@shared/item-validator";
import { inferQueryOutput, trpc, inferMutationInput } from "src/utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { imgToBase64 } from "src/utils/common";
import { useState } from "react";

// type EditItemFields = inferMutationInput<"item.create-item">;
type EditItemProps = {
  data: Omit<inferQueryOutput<"item.get-item">[number], "category">;
};

export default function EditItem({ data }: EditItemProps) {
  const [imageString, setImageString] = useState(data.image ? data.image : "");
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
    setValue,
    watch,
  } = useForm<ItemValidatorWithFile>({ resolver: zodResolver(createItemValidatorWithFile), defaultValues: rest });

  const addMaterial: SubmitHandler<ItemValidatorWithFile> = async values => {
    const { files, ...rest } = values;
    console.log(values);
    const image = await imgToBase64(values.files && values.files[0]);
    console.log(image);
    mutate({ ...values, image, id });
  };
  const files = watch().files;
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
              {files && files[0] ? (
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
                  <Image src={URL.createObjectURL(files[0])} alt={"product-image"} width={80} height={80} />
                </Flex>
              ) : imageString !== "" ? (
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
                      {/* {files[0].name} */}
                    </Text>{" "}
                    <Button
                      size={"sm"}
                      colorScheme="red"
                      onClick={() => {
                        setImageString("");
                      }}
                    >
                      Xóa
                    </Button>
                  </Flex>
                  <Image src={imageString} alt={"product-image"} width={80} height={80} />
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
