import { Flex, Button, FormControl, FormLabel, Input, Alert, Text, Box } from "@chakra-ui/react";
import { CreateProductValues } from "@shared/validators/product-validator";
import Image from "next/legacy/image";
import { useState } from "react";
import { Control, useController } from "react-hook-form";

type UploadImageProps = {
  control: Control<CreateProductValues>;
  isLoading: boolean;
  image?: string;
};

const UploadImage = ({ control, isLoading, image }: UploadImageProps) => {
  const { field, fieldState } = useController({ control, name: "file" });

  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState<File | string | undefined>(field.value);

  return (
    <>
      {(typeof file === "string" || edit) && (
        <Text
          onClick={() =>
            setEdit(prev => {
              if (!prev === false) {
                field.onChange(image);
                setFile(image);
              }

              return !prev;
            })
          }
          cursor={"pointer"}
          _hover={{ textDecoration: "underline" }}
          color={"blue.400"}
        >
          {!edit ? "Chỉnh sửa" : "Thoát chỉnh sửa"}
        </Text>
      )}

      {typeof file !== "string" && file instanceof File && (
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
              {file.name}
            </Text>
            <Button
              size={"sm"}
              colorScheme="red"
              onClick={() => {
                setFile(image);
                field.onChange(image);
              }}
            >
              Xóa
            </Button>
          </Flex>
          <Image src={URL.createObjectURL(file)} alt={"product-image"} width={80} height={80} />{" "}
        </Flex>
      )}
      {(!file || edit) && (
        <FormControl mt={4} isInvalid={!!fieldState.error} isDisabled={isLoading}>
          <FormLabel
            onDrop={event => {
              event.preventDefault();
              setFile(event.dataTransfer.files[0]);
              field.onChange(event.dataTransfer.files[0]);
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
          <Input
            onChange={event => {
              if (event.target.files) {
                setFile(event.target.files[0]);
                field.onChange(event.target.files[0]);
              }
            }}
            type="file"
            srOnly
            accept=".jpg, .jpeg, .png, .webp"
          />
        </FormControl>
      )}

      {typeof file === "string" && !edit && (
        <Flex justifyContent={"center"}>
          <Image
            objectFit="contain"
            src={typeof field.value === "string" ? field.value : image!}
            alt={"product-image"}
            width={250}
            height={200}
          />
        </Flex>
      )}

      {fieldState.error && (
        <Alert fontSize={"sm"} fontWeight={400} my={2} px={4} py={2} rounded={"md"} status="error">
          {fieldState.error.message}
        </Alert>
      )}
    </>
  );
};

export default UploadImage;
