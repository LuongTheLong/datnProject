import { useState } from "react";
import {
  Heading,
  Box,
  Text,
  Button,
  Spinner,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  Stack,
  FormLabel,
  Checkbox,
  RadioGroup,
  Icon,
  Badge,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import type { Product } from "@prisma/client";
import type { ProductOptions, OptionCategory } from "@shared/validators/options-validator";
import type { Control } from "react-hook-form";

import { BiError, BiCheck } from "react-icons/bi";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { useForm, useController, useWatch } from "react-hook-form";
import { isEqual, differenceWith } from "lodash-es";
import Image from "next/legacy/image";

import { trpc, InferOutput } from "@utils/trpc";
import { calculateOptionsTotal, formatPrice } from "@utils/common";
import { signIn, useSession } from "next-auth/react";

type Options = InferOutput["options"]["getByCategory"];
type Choice = Options[number]["choices"][number];

type OptionsInputProps = { control: Control<ProductOptions>; option: Options[number]; isLoading: boolean };

const OptionsCheckbox = ({ control, option, isLoading }: OptionsInputProps) => {
  const [selects, setSelects] = useState<Choice[]>([]);
  const ALLOWED_SELECTION = option.limit;
  const code = option.code as OptionCategory;

  const { field } = useController({
    control,
    name: code,
    rules: {
      shouldUnregister: true,
    },
  });

  const isSelected = (id: string) => {
    return selects.some(item => item.id === id);
  };

  return (
    <Box>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <FormLabel htmlFor={option.code} fontSize={16} color={"rgb(25, 25, 25)"} fontWeight={700}>
          {option.title}
        </FormLabel>

        <Badge
          px={2}
          py={0.5}
          fontSize={11}
          textTransform="none"
          colorScheme="green"
        >{`Tùy chọn (Tối đa ${option.limit}) `}</Badge>
      </Flex>

      <Flex flexDirection={"column"} gap={4}>
        {option.choices.map((choice, idx) => (
          <Checkbox
            isDisabled={(!isSelected(choice.id) && selects.length === ALLOWED_SELECTION) || isLoading}
            key={choice.id}
            value={choice.id}
            colorScheme="red"
            borderColor={"black"}
            checked={isSelected(choice.id)}
            onChange={event => {
              let selectsCopy = [...selects];

              if (event.target.checked) {
                selectsCopy.push(option.choices[idx]!);
              } else {
                selectsCopy = selectsCopy.filter(item => item.id !== option.choices[idx]!.id);
              }

              field.onChange(selectsCopy);
              setSelects(selectsCopy);
            }}
          >
            <Text
              ml={2}
              fontSize={14}
              color={"rgb(25, 25, 25)"}
              fontWeight={500}
            >{`${choice.title} (+${choice.price})`}</Text>
          </Checkbox>
        ))}
      </Flex>
    </Box>
  );
};

const OptionsRadio = ({ control, option, isLoading }: OptionsInputProps) => {
  const [selects, setSelects] = useState<Choice[]>([]);
  const code = option.code as OptionCategory;

  const { field, formState } = useController({
    name: code,
    control,
    rules: {
      validate: values => {
        if (!values || (Array.isArray(values) && values.length === 0)) {
          return "ERROR";
        }
      },
    },
  });

  const hasError = formState.errors[code] || selects.length === 0;

  return (
    <Box>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <FormLabel htmlFor={code} fontSize={16} color={"rgb(25, 25, 25)"} fontWeight={700}>
          {option.title}
        </FormLabel>

        <Badge
          colorScheme={hasError ? "yellow" : "green"}
          fontSize={11}
          textTransform="none"
          display={"flex"}
          alignItems={"center"}
          px={2}
          py={0.5}
        >
          <Icon as={hasError ? BiError : BiCheck} w={4} h={4} color={!!hasError ? "yellow.500" : "green"} mr={1} /> Bắt
          buộc
        </Badge>
      </Flex>

      <RadioGroup
        isDisabled={isLoading}
        onChange={id => {
          const targetValue = option.choices.find(item => item.id === id);

          if (targetValue) {
            field.onChange([targetValue]);
            setSelects([targetValue]);
          }
        }}
        value={selects[0]?.id}
      >
        <Flex flexDirection={"column"} gap={4}>
          {option.choices.map(choice => (
            <Radio key={choice.id} value={choice.id} colorScheme="red" borderColor={"black"}>
              <Text
                fontSize={14}
                color={"rgb(25, 25, 25)"}
                fontWeight={500}
              >{`${choice.title} (+${choice.price})`}</Text>
            </Radio>
          ))}
        </Flex>
      </RadioGroup>
    </Box>
  );
};

type QuantityInputProps = {
  control: Control<ProductOptions>;
  isLoading: boolean;
};

const QuantityInput = ({ control, isLoading }: QuantityInputProps) => {
  const [quantity, setQuantity] = useState(1);
  const { field } = useController({ control, name: "quantity" });

  return (
    <Stack direction={"row"} spacing={2} alignItems="center" mr={4}>
      <Icon
        as={AiOutlineMinusCircle}
        width={6}
        height={6}
        cursor="pointer"
        _hover={{ color: "crimson" }}
        onClick={() => {
          const newQuantity = quantity - 1;
          setQuantity(newQuantity);

          field.onChange(newQuantity);
        }}
        color={quantity === 1 ? "gray" : "black"}
        pointerEvents={quantity === 1 || isLoading ? "none" : "auto"}
      />

      <Box
        height={"40px"}
        bg={"rgb(247, 247, 247)"}
        rounded="md"
        width={"64px"}
        pointerEvents={"none"}
        fontWeight={600}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {quantity}
      </Box>
      <Box display="flex" justifyContent={"center"} alignItems="center"></Box>
      <Icon
        as={AiOutlinePlusCircle}
        width={6}
        height={6}
        cursor="pointer"
        _hover={{ color: "crimson" }}
        onClick={() => {
          const newQuantity = quantity + 1;
          setQuantity(newQuantity);
          field.onChange(newQuantity);
        }}
        color={quantity === 10 ? "gray" : "black"}
        pointerEvents={quantity === 10 || isLoading ? "none" : "auto"}
      />
    </Stack>
  );
};

type AddToCartButtonProps = {
  control: Control<ProductOptions>;
  productPrice: number;
  hasError: boolean;
  isLoading: boolean;
};

const AddToCartButton = ({ control, productPrice, hasError, isLoading }: AddToCartButtonProps) => {
  const values = useWatch({ control }) as ProductOptions;
  const session = useSession();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const total = calculateOptionsTotal({ price: productPrice, values });

  return (
    <>
      <Button
        fontWeight={700}
        colorScheme="red"
        rounded={"full"}
        type={session.status === "authenticated" ? "submit" : "button"}
        isLoading={isLoading}
        isDisabled={isLoading || hasError}
        onClick={() => {
          if (session.status !== "authenticated") {
            onOpen();
          }
        }}
      >
        Thêm vào giỏ - {formatPrice(total)} VNĐ
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        onCloseComplete={() => {
          signIn();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader></ModalHeader>
          <ModalBody textAlign={"center"}>Vui lòng đăng nhập để mua hàng</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

type ModalProps = {
  item: Product;
  onClose: () => void;
  isOpen: boolean;
};

const AddToCartModal = ({ item, onClose, isOpen }: ModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductOptions>({
    defaultValues: {
      quantity: 1,
    },
  });

  const t = trpc.useContext();
  const optionsQuery = trpc.options.getByCategory.useQuery(
    {
      categoryId: item.categoryId,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const toast = useToast();

  const cartMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      t.cart.getAll.invalidate();
      toast({
        title: "Thêm sản phẩm thành công",
        status: "success",
        isClosable: true,
        position: "top",
        duration: 2500,
      });
      onClose();
    },
  });

  const hasError = Object.keys(errors).length > 0;

  const onSubmit = handleSubmit(values => {
    const { quantity, ...rest } = values;

    let options: Choice[] = [];

    Object.keys(rest).forEach(key => {
      const option = rest[key as OptionCategory];

      if (option) {
        options = options.concat(option);
      }
    });

    const itemsInCart = t.cart.getAll.getData();

    const itemExisted = itemsInCart?.cart.find(
      cartItem =>
        cartItem.product.id === item.id && differenceWith(options, cartItem.option as Choice[], isEqual).length === 0
    );

    if (itemExisted) {
      cartMutation.mutate({
        id: itemExisted.id,
        option: options,
        productId: item.id,
        quantity,
      });
    } else {
      cartMutation.mutate({
        id: null,
        option: options,
        productId: item.id,
        quantity,
      });
    }
  });

  return (
    <Box position={"fixed"}>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={"inside"}
        closeOnOverlayClick={!cartMutation.isLoading}
        motionPreset={"none"}
      >
        <form onSubmit={onSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader px={4} py={2} position={"relative"}>
              <ModalCloseButton position={"unset"} />
            </ModalHeader>

            <ModalBody padding={4}>
              <Heading as="h3" size="lg" mb={4}>
                {item.title}
              </Heading>

              <Text fontSize={14} lineHeight={1.5} fontWeight={500} mb={8}>
                {item.description}
              </Text>

              <Box mb={8}>
                <Image
                  src={item.image!}
                  alt={item.title}
                  width={500}
                  height={300}
                  objectFit={"cover"}
                  layout="responsive"
                />
              </Box>

              {optionsQuery.isLoading && (
                <Flex justifyContent={"center"} alignItems="center">
                  <Spinner color="crimson" size="lg" />
                </Flex>
              )}

              {optionsQuery.data &&
                optionsQuery.data.map(option => (
                  <Box
                    key={option.code}
                    pb={4}
                    mb={4}
                    borderBottom={"1px solid"}
                    borderBottomColor={"rgb(231, 231, 231)"}
                  >
                    {option.kind === "CHECKBOX" && (
                      <OptionsCheckbox control={control} option={option} isLoading={cartMutation.isLoading} />
                    )}
                    {option.kind === "RADIO" && (
                      <OptionsRadio control={control} option={option} isLoading={cartMutation.isLoading} />
                    )}
                  </Box>
                ))}
            </ModalBody>
            <ModalFooter>
              {!optionsQuery.isLoading && (
                <>
                  <QuantityInput isLoading={cartMutation.isLoading} control={control} />
                  <AddToCartButton
                    control={control}
                    hasError={hasError}
                    isLoading={cartMutation.isLoading}
                    productPrice={item.price}
                  />
                </>
              )}
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  );
};

export default AddToCartModal;
