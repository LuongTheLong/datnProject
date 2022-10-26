import CommonLayout from "@layout/common-layout";
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
  Input,
  Checkbox,
  RadioGroup,
  Icon,
} from "@chakra-ui/react";
import { useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { trpc } from "src/utils/trpc";
import { Product } from "@prisma/client";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

const OPTIONS = [
  {
    id: 1,
    title: "Kích cỡ",
    code: "size",
    kind: "radio",
    limit: 1,
    choices: [
      { id: 3, title: "Vừa", price: 0 },
      { id: 4, title: "Lớn", price: 10000 },
    ],
  },
  {
    id: 2,
    title: "Sốt",
    code: "sauce",
    kind: "checkbox",
    limit: 2,
    choices: [
      { id: 5, title: "Tương ớt", price: 1000 },
      { id: 6, title: "Sốt tiêu đen", price: 2000 },
      { id: 7, title: "Sốt bò", price: 3000 },
    ],
  },
];

const OptionsCheckbox = ({
  option,
  selectedOptions,
  setSelectedOptions,
}: {
  option: typeof OPTIONS[number];
  selectedOptions: { id: number; title: string; price: number }[];
  setSelectedOptions: Dispatch<
    SetStateAction<
      {
        id: number;
        title: string;
        price: number;
      }[]
    >
  >;
}) => {
  const [checkCount, setCheckCount] = useState(0);
  const ALLOWED_SELECTION = 2;

  const isChecked = (id: number) => {
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
          <Text fontSize={14} color={"rgb(25, 25, 25)"} fontWeight={500}>{`${choice.title} (+${choice.price})`}</Text>
        </Checkbox>
      ))}
    </Flex>
  );
};

const ProductCard: React.FC<{ item: Product }> = ({ item }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [price, setPrice] = useState(item.price);
  const [selectedOptions, setSelectedOptions] = useState<{ id: number; title: string; price: number }[]>([]);
  const [quantity, setQuantity] = useState(1);

  const choicesId = selectedOptions.map(option => option.id);
  const total = quantity * (selectedOptions.reduce((prev, curr) => prev + curr.price, 0) + price);

  return (
    <>
      {isOpen && (
        <Box position={"fixed"}>
          <Modal onClose={onClose} isOpen={isOpen} scrollBehavior={"inside"}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader></ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Heading as="h3" size="lg" mb={4}>
                  {item.title}
                </Heading>

                <Text fontSize={14} lineHeight={1.5} fontWeight={500} mb={8}>
                  Món ăn này vừa gọn nhẹ, thuận tiện, nhanh no, dễ ăn và phù hợp với khẩu vị của nhiều người. Nếu bạn
                  cần dinh dưỡng thì hãy nghĩ ngay đến chiếc bánh này cho khẩu phần ăn nhé!
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
                {OPTIONS.map(option => (
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

                    {option.kind === "checkbox" ? (
                      <OptionsCheckbox
                        option={option}
                        setSelectedOptions={setSelectedOptions}
                        selectedOptions={selectedOptions}
                      />
                    ) : (
                      <RadioGroup
                        name={option.code}
                        onChange={event => {
                          const selectedOption = option.choices.find(choice => choice.id === parseInt(event));

                          const ids = option.choices.map(choice => choice.id);

                          if (selectedOption) {
                            setSelectedOptions(prev =>
                              prev.filter(item => !ids.includes(item.id)).concat(selectedOption)
                            );
                          }
                        }}
                        value={option.choices.find(choice => choicesId.includes(choice.id))?.id}
                      >
                        <Stack spacing={4} direction="row">
                          {option.choices.map(choice => (
                            <Radio key={choice.id} value={choice.id} colorScheme="red">
                              <Text
                                fontSize={14}
                                color={"rgb(25, 25, 25)"}
                                fontWeight={500}
                              >{`${choice.title} (+${choice.price})`}</Text>
                            </Radio>
                          ))}
                        </Stack>
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
                  >
                    <Input
                      width={"100%"}
                      defaultValue={1}
                      focusBorderColor="black"
                      textAlign="center"
                      pattern="[0-9]*"
                      fontWeight={600}
                      pointerEvents={"none"}
                      value={quantity}
                    />
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
                <Button fontWeight={700} colorScheme="red" rounded={"full"} onClick={onClose}>
                  Thêm vào giỏ - {total} VNĐ
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}

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

const Categories: NextPageWithLayout = () => {
  const router = useRouter();

  const categoryQuery = trpc.category.getBySlug.useQuery(
    { slug: router.query.category as string },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const productsQuery = trpc.product.getInfiniteProducts.useInfiniteQuery(
    { slug: router.query.category as string, limit: 7 },
    { getNextPageParam: lastPage => lastPage.nextCursor, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  return (
    <Container maxW={"6xl"} my={8}>
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
    </Container>
  );
};

Categories.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};
export default Categories;
