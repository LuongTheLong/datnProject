import { NextPageWithLayout } from "./_app";
import { useRef } from "react";
import CommonLayout from "@layout/common-layout";
import { Flex, Container, Text, IconButton, Heading, Box } from "@chakra-ui/react";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { Navigation } from "swiper";
import { trpc } from "src/utils/trpc";
import NextLink from "next/link";
import CaptionCarousel from "../components/slide"

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


type CategoryProductsOutput = InferProcedures["category"]["getProductsByCategories"]["output"][number];

const ProductCarousel = (props: CategoryProductsOutput) => {
  const navigationPrevRef = useRef<HTMLDivElement>(null);
  const navigationNextRef = useRef<HTMLDivElement>(null);

  const { products, slug, title } = props;

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
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </Box>
    </>
  );
};

const Home: NextPageWithLayout = () => {
  const itemsQuery = trpc.category.getProductsByCategories.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <CaptionCarousel />
      <Container maxW={"6xl"}>
        <Flex flexDirection={"column"} gap={8}>
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
