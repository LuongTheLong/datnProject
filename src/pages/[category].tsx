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
  RadioGroup,
  Radio,
  Stack,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { trpc } from "src/utils/trpc";
import { Product } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

const OPTIONS = [
  {
    title: "Kích cỡ",
    code: "size",
    choices: [
      { title: "Vừa", price: 0 },
      { title: "Lớn", price: 10000 },
    ],
  },
  {
    title: "Tương ớt",
    code: "tuong-ot",
    choices: [
      { title: "Có", price: 0 },
      { title: "Không", price: 0 },
    ],
  },
  {
    title: "Sốt tiêu đen",
    code: "sot-tieu-den",
    choices: [
      { title: "Có", price: 0 },
      { title: "Không", price: 0 },
    ],
  },
];

const ProductCard: React.FC<{ item: Product }> = ({ item }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { handleSubmit, control, watch } = useForm();

  const onSubmit = (data: any) => console.log(data);

  return (
    <>
      {isOpen && (
        <Box position={"fixed"}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                      <Controller
                        control={control}
                        name={option.code}
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <Stack spacing={4} direction="row">
                              {option.choices.map(choice => (
                                <Radio key={choice.title} value={choice.title} colorScheme="red">
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
                      />
                    </Box>
                  ))}
                </ModalBody>
                <ModalFooter>
                  <Stack direction={"row"} spacing={2} alignItems="center" mr={4}>
                    <AiOutlineMinusCircle fontSize={24} />
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
                      />
                    </Box>

                    <AiOutlinePlusCircle fontSize={24} />
                  </Stack>
                  <Button fontWeight={700} colorScheme="red" rounded={"full"} onClick={onClose}>
                    Thêm vào giỏ - 120.000 VNĐ
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </form>
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
    }
  );

  const productsQuery = trpc.product.getInfiniteProducts.useInfiniteQuery(
    { slug: router.query.category as string, limit: 7 },
    { getNextPageParam: lastPage => lastPage.nextCursor }
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
