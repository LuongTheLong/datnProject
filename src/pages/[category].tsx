import { useState, Dispatch, SetStateAction } from "react";
import {
  Container,
  Heading,
  Grid,
  GridItem,
  Box,
  Text,
  Button,
  Spinner,
  Flex,
  useDisclosure,
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
} from "@chakra-ui/react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import Image from "next/image";
import { trpc, InferProcedures } from "src/utils/trpc";
import { Product, Choice } from "@prisma/client";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import CommonLayout from "@layout/common-layout";
import { useToast } from "@chakra-ui/react";

import { isEqual, differenceWith } from "lodash-es";

type Options = InferProcedures["options"]["getByCategory"]["output"];

const OptionsCheckbox = ({
  option,
  selectedOptions,
  setSelectedOptions,
}: {
  option: Options[number];
  selectedOptions: Choice[];
  setSelectedOptions: Dispatch<SetStateAction<Choice[]>>;
}) => {
  const [checkCount, setCheckCount] = useState(0);
  const ALLOWED_SELECTION = option.limit;

  const isChecked = (id: string) => {
    return selectedOptions.some(option => option.id === id);
  };

  return (
    <Flex flexDirection={"column"} gap={4}>
      {option.choices.map(choice => (
        <Checkbox
          isDisabled={!isChecked(choice.id) && checkCount === ALLOWED_SELECTION}
          key={choice.id}
          value={choice.id}
          colorScheme="red"
          borderColor={"black"}
          checked={isChecked(choice.id)}
          onChange={event => {
            if (event.target.checked) {
              setSelectedOptions(prev => prev.concat(choice));
              setCheckCount(prev => prev + 1);
            } else {
              setSelectedOptions(prev => prev.filter(item => item.id !== choice.id));
              setCheckCount(prev => prev - 1);
            }
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
  );
};

type ModalProps = {
  item: Product;
  categoryId: string;
  onClose: () => void;
  isOpen: boolean;
};

const AddToCartModal = ({ item, onClose, isOpen }: ModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Choice[]>([]);
  const [quantity, setQuantity] = useState(1);

  const t = trpc.useContext();
  const toast = useToast();

  const choicesId = selectedOptions.map(option => option.id);
  const total = quantity * (selectedOptions.reduce((prev, curr) => prev + curr.price, 0) + item.price);

  const optionsQuery = trpc.options.getByCategory.useQuery(
    {
      categoryId: item.categoryId,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

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

  const addToCart = () => {
    const itemsInCart = t.cart.getAll.getData();

    const itemExisted = itemsInCart?.cart.find(
      cartItem =>
        cartItem.product.id === item.id &&
        differenceWith(selectedOptions, cartItem.option as Choice[], isEqual).length === 0
    );

    if (itemExisted) {
      cartMutation.mutate({
        id: itemExisted.id,
        option: selectedOptions,
        productId: item.id,
        quantity,
      });
    } else {
      cartMutation.mutate({
        id: null,
        option: selectedOptions,
        productId: item.id,
        quantity,
      });
    }
  };

  return (
    <Box position={"fixed"}>
      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior={"inside"}>
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
              Món ăn này vừa gọn nhẹ, thuận tiện, nhanh no, dễ ăn và phù hợp với khẩu vị của nhiều người. Nếu bạn cần
              dinh dưỡng thì hãy nghĩ ngay đến chiếc bánh này cho khẩu phần ăn nhé!
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
                  <FormLabel htmlFor={option.code} fontSize={16} color={"rgb(25, 25, 25)"} fontWeight={700} mb={2}>
                    {option.title}
                  </FormLabel>

                  {option.kind === "CHECKBOX" ? (
                    <OptionsCheckbox
                      option={option}
                      setSelectedOptions={setSelectedOptions}
                      selectedOptions={selectedOptions}
                    />
                  ) : (
                    <RadioGroup
                      name={option.code}
                      onChange={event => {
                        const selectedOption = option.choices.find(choice => choice.id === event);

                        const ids = option.choices.map(choice => choice.id);

                        if (selectedOption) {
                          setSelectedOptions(prev =>
                            prev.filter(item => !ids.includes(item.id)).concat(selectedOption)
                          );
                        }
                      }}
                      value={option.choices.find(choice => choicesId.includes(choice.id))?.id}
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
                  )}
                </Box>
              ))}
          </ModalBody>
          <ModalFooter>
            <Stack direction={"row"} spacing={2} alignItems="center" mr={4}>
              <Icon
                as={AiOutlineMinusCircle}
                width={6}
                height={6}
                cursor="pointer"
                _hover={{ color: "crimson" }}
                onClick={() => setQuantity(prev => (prev === 1 ? prev : prev - 1))}
                color={quantity === 1 ? "gray" : "black"}
                pointerEvents={quantity === 1 ? "none" : "auto"}
              />

              <Box
                height={"40px"}
                display="flex"
                justifyContent={"center"}
                alignItems="center"
                bg={"rgb(247, 247, 247)"}
                rounded="md"
                width={"64px"}
                pointerEvents={"none"}
              >
                <Text width={"100%"} textAlign="center" fontWeight={600}>
                  {quantity}
                </Text>
              </Box>

              <Icon
                as={AiOutlinePlusCircle}
                width={6}
                height={6}
                cursor="pointer"
                _hover={{ color: "crimson" }}
                onClick={() => setQuantity(prev => (prev === 10 ? prev : prev + 1))}
                color={quantity === 15 ? "gray" : "black"}
                pointerEvents={quantity === 15 ? "none" : "auto"}
              />
            </Stack>
            <Button
              fontWeight={700}
              colorScheme="red"
              rounded={"full"}
              onClick={addToCart}
              isLoading={cartMutation.isLoading}
              isDisabled={cartMutation.isLoading}
            >
              Thêm vào giỏ - {total} VNĐ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const ProductCard: React.FC<{ item: Product }> = ({ item }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isOpen && <AddToCartModal categoryId={item.categoryId} isOpen={isOpen} item={item} onClose={onClose} />}

      <GridItem w="100%" h="100%" onClick={onOpen} cursor="pointer">
        <Box mb={3} rounded={"md"} overflow={"hidden"}>
          <Image src={item.image!} alt={item.title} width={400} height={220} objectFit={"cover"} layout="responsive" />
        </Box>

        <Heading as="h5" size="sm" mb={1}>
          {item.title}
        </Heading>
        <Text color={"gray.600"} fontWeight={500}>
          {item.price} VNĐ
        </Text>
      </GridItem>
    </>
  );
};

const ProductGrid = ({ category }: { category: string }) => {
  const categoryQuery = trpc.category.getBySlug.useQuery(
    { slug: category },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const productsQuery = trpc.product.getInfiniteProducts.useInfiniteQuery(
    { slug: category, limit: 7 },
    { getNextPageParam: lastPage => lastPage.nextCursor, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  return (
    <>
      {productsQuery.data && categoryQuery.data && (
        <>
          <Heading as="h2" size="2xl" mb={8}>
            {categoryQuery.data.title}
          </Heading>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {productsQuery.data &&
              productsQuery.data.pages.length > 0 &&
              productsQuery.data.pages.map(page =>
                page.products.map(item => <ProductCard item={item} key={item.id} />)
              )}
          </Grid>
          {productsQuery.hasNextPage && (
            <Box textAlign={"center"} mt={6}>
              <Button
                bg={"gray.100"}
                isLoading={productsQuery.isFetchingNextPage}
                loadingText={"Đang xử lý"}
                rounded={"full"}
                onClick={() => productsQuery.fetchNextPage()}
              >
                Xem thêm
              </Button>
            </Box>
          )}
        </>
      )}

      {productsQuery.isLoading && categoryQuery.isLoading && (
        <Flex justifyContent={"center"} alignItems="center">
          <Spinner color="crimson" size="xl" />
        </Flex>
      )}
    </>
  );
};

const Categories: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <Container maxW={"6xl"} my={8}>
      {router.isReady && <ProductGrid category={router.query.category as string} />}
    </Container>
  );
};

Categories.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};
export default Categories;
