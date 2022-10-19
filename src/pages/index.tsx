import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { BiPlus, BiMinus } from "react-icons/bi";
import { NextPageWithLayout } from "./_app";
import { useRef } from "react";
import CommonLayout from "@layout/common-layout";
import { Flex, Container, Text, IconButton, Heading, Box } from "@chakra-ui/react";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { Navigation } from "swiper";
import { trpc } from "src/utils/trpc";
import NextLink from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { InferProcedures } from "src/utils/trpc";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// Import Swiper styles
import "swiper/css";

import Image from "next/image";
import FastFood from "../assets/fast-food.svg";
import Drink from "../assets/drink.svg";
import Hamburger from "../assets/banh-mi.svg";
import Pizza from "../assets/pizza.svg";
import Dessert from "../assets/trang-mieng.svg";
import Breakfast from "../assets/breakfast.svg";
import Filter from "@components/filter";

const CATEGORIES = [
  {
    title: "Đồ ăn nhanh",
    slug: "do-an-nhanh",
    image: FastFood,
  },
  {
    title: "Thức uống",
    slug: "thuc-uong",
    image: Drink,
  },
  {
    title: "Dessert",
    slug: "dessert",
    image: Dessert,
  },
  {
    title: "Pizza",
    slug: "pizza",
    image: Pizza,
  },
  {
    title: "Bánh mì",
    slug: "banh-mi",
    image: Hamburger,
  },
  {
    title: "Ăn sáng",
    slug: "an-sang",
    image: Breakfast,
  },
];

const CategoryList = () => {
  return (
    <Flex alignItems={"center"} gap={6} justifyContent="center">
      {CATEGORIES.map(category => (
        <Flex
          key={category.slug}
          flexDir={"column"}
          alignItems="center"
          cursor={"pointer"}
          transition={"all 250ms ease"}
          _hover={{ color: "crimson" }}
        >
          <Image width={100} height={100} src={category.image} alt={category.slug} layout="fixed" />
          <Text fontSize={15} fontWeight={600}>
            {category.title}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};
type CategoryProductsOutput = InferProcedures["category"]["getProductsByCategories"]["output"][number];

const ProductCarousel = (props: CategoryProductsOutput) => {
  const navigationPrevRef = useRef<HTMLDivElement>(null);
  const navigationNextRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { products, slug, title } = props;
  console.log(props);
  return (
    <>
      <Box mb={6}>
        <div>
          <Flex alignItems={"center"} mb={4}>
            <Heading as="h3" size="lg" mb={2} textTransform={"initial"}>
              {title}
            </Heading>
            <Flex alignItems={"center"} gap={2} ml={"auto"}>
              <NextLink href={{ pathname: "/[category]", query: { category: slug } }} passHref>
                <Text
                  cursor={"pointer"}
                  _hover={{ color: "crimson" }}
                  transition={"all 250ms ease"}
                  fontWeight={"medium"}
                  mr={2}
                >
                  Xem tất cả
                </Text>
              </NextLink>

              <div ref={navigationPrevRef}>
                <IconButton
                  bg={"gray.100"}
                  rounded="full"
                  aria-label="Search database"
                  icon={<MdOutlineArrowBackIos />}
                />
              </div>
              <div ref={navigationNextRef}>
                <IconButton
                  bg={"gray.100"}
                  rounded="full"
                  aria-label="Search database"
                  icon={<MdOutlineArrowForwardIos />}
                />
              </div>
            </Flex>
          </Flex>

          <Swiper
            // install Swiper modules
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={3}
            navigation={{
              prevEl: navigationPrevRef.current!, // Assert non-null
              nextEl: navigationNextRef.current!, // Assert non-null
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            onInit={swiper => {
              // @ts-ignore
              swiper.params.navigation.prevEl = navigationPrevRef.current;

              // @ts-ignore
              swiper.params.navigation.nextEl = navigationNextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
          >
            {products.length > 0 &&
              products.map(product => (
                <SwiperSlide key={product.id}>
                  <Box onClick={onOpen} cursor="pointer">
                    <Box mb={3} rounded={"md"} overflow={"hidden"}>
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={400}
                        height={220}
                        objectFit={"cover"}
                        layout="responsive"
                      />
                    </Box>

                    <Heading as="h5" size="sm" mb={1}>
                      {product.title}
                    </Heading>
                    <Text color={"gray.600"} fontWeight={500}>
                      {product.price} VNĐ
                    </Text>
                  </Box>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </Box>
      <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen} size={"sm"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" fontSize={24}>
            Thêm món mới
            <Button bg={"crimson"} _hover={{ bg: "#ba0f31" }} rounded={"full"} width={"full"} mt={4}>
              <Flex alignItems={"center"} justifyContent="space-between" width={"full"}>
                <Text color={"white"} fontWeight={700}>
                  Thêm vào giỏ hàng
                </Text>
                <Text color={"white"} fontWeight={700}>
                  20.000 VNĐ
                </Text>
              </Flex>
            </Button>
          </DrawerHeader>
          <DrawerBody>
            <Flex
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={2}
              py={3}
              borderBottom={"1px"}
              borderColor={"gray.200"}
            >
              <Box>
                <Text mb={2} fontWeight="500">
                  Bánh mì kẹp Long
                </Text>
                <Text fontSize={14} fontWeight={500}>
                  20.000 VNĐ
                </Text>
              </Box>
              <HStack boxShadow={"rgb(0 0 0 / 20%) 0px 2px 8px"} rounded={"full"} overflow="hidden" bg={"white"}>
                <Box>
                  <IconButton
                    bg={"transparent"}
                    rounded="none"
                    size="sm"
                    aria-label="Search database"
                    icon={<BiMinus fontSize={20} />}
                    _hover={{ color: "crimson", bg: "transparent" }}
                  />
                </Box>
                <Box>
                  <Text fontWeight={"medium"}>2</Text>
                </Box>
                <Box>
                  <IconButton
                    bg={"transparent"}
                    rounded="none"
                    size="sm"
                    aria-label="Search database"
                    icon={<BiPlus fontSize={20} />}
                    _hover={{ color: "crimson", bg: "transparent" }}
                  />
                </Box>
              </HStack>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const Home: NextPageWithLayout = () => {
  const itemsQuery = trpc.category.getProductsByCategories.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Container maxW={"6xl"}>
        <Flex flexDirection={"column"} gap={8}>
          <CategoryList />
          <Filter />

          {!itemsQuery.isLoading &&
            itemsQuery.data &&
            itemsQuery.data.map(category => <ProductCarousel key={category.id} {...category} />)}
        </Flex>
      </Container>
    </>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Home;
