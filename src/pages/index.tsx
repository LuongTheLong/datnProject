import { NextPageWithLayout } from "./_app";
import { useRef } from "react";
import CommonLayout from "@layout/common-layout";
import { Flex, Container, Text, IconButton, Heading, Box } from "@chakra-ui/react";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { Navigation } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

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

const CategoryList = () => {
  return (
    <Flex alignItems={"center"} gap={6} justifyContent="center">
      <Flex
        flexDir={"column"}
        alignItems="center"
        cursor={"pointer"}
        transition={"all 250ms ease"}
        _hover={{ color: "crimson" }}
      >
        <Image width={100} height={100} src={FastFood} alt="do-an-nhanh" layout="fixed" />
        <Text fontSize={15} fontWeight={600}>
          Đồ ăn nhanh
        </Text>
      </Flex>
      <Flex
        flexDir={"column"}
        alignItems="center"
        cursor={"pointer"}
        transition={"all 250ms ease"}
        _hover={{ color: "crimson" }}
      >
        <Image width={100} height={100} src={Drink} alt="nuoc-uong" layout="fixed" />
        <Text fontSize={15} fontWeight={600}>
          Thức uống
        </Text>
      </Flex>
      <Flex
        flexDir={"column"}
        alignItems="center"
        cursor={"pointer"}
        transition={"all 250ms ease"}
        _hover={{ color: "crimson" }}
      >
        <Image width={100} height={100} src={Dessert} alt="trang-mieng" layout="fixed" />
        <Text fontSize={15} fontWeight={600}>
          Dessert
        </Text>
      </Flex>
      <Flex
        flexDir={"column"}
        alignItems="center"
        cursor={"pointer"}
        transition={"all 250ms ease"}
        _hover={{ color: "crimson" }}
      >
        <Image width={100} height={100} src={Pizza} alt="pizza" layout="fixed" />
        <Text fontSize={15} fontWeight={600}>
          Pizza
        </Text>
      </Flex>
      <Flex
        flexDir={"column"}
        alignItems="center"
        cursor={"pointer"}
        transition={"all 250ms ease"}
        _hover={{ color: "crimson" }}
      >
        <Image width={100} height={100} src={Hamburger} alt="banh-mi" layout="fixed" />
        <Text fontSize={15} fontWeight={600}>
          Bánh mì
        </Text>
      </Flex>
      <Flex
        flexDir={"column"}
        alignItems="center"
        cursor={"pointer"}
        transition={"all 250ms ease"}
        _hover={{ color: "crimson" }}
      >
        <Image width={100} height={100} src={Breakfast} alt="an-sang" layout="fixed" />
        <Text fontSize={15} fontWeight={600}>
          Ăn sáng
        </Text>
      </Flex>
    </Flex>
  );
};

const ProductCarousel = () => {
  const navigationPrevRef = useRef<HTMLDivElement>(null);
  const navigationNextRef = useRef<HTMLDivElement>(null);

  return (
    <Box mb={6}>
      <Heading as="h3" size="lg" mb={2}>
        Đồ ăn nhanh
      </Heading>
      <div>
        <Flex alignItems={"center"} gap={2} justifyContent="end" mb={4}>
          <div ref={navigationPrevRef}>
            <IconButton bg={"gray.100"} rounded="full" aria-label="Search database" icon={<MdOutlineArrowBackIos />} />
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
            // eslint-disable-next-line no-param-reassign
            swiper.params.navigation.prevEl = navigationPrevRef.current;

            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            swiper.params.navigation.nextEl = navigationNextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          <SwiperSlide>
            <div>
              <Box mb={3}>
                <Image
                  src={"https://res.cloudinary.com/dlbkvfo8l/image/upload/v1664931321/pic-4_wh93ii.jpg"}
                  alt={"pic-1"}
                  width={400}
                  height={220}
                  objectFit={"cover"}
                  layout="responsive"
                />
              </Box>

              <Heading as="h5" size="sm" mb={1}>
                Bánh Hamburger
              </Heading>
              <Text color={"gray.600"} fontWeight={500}>
                40.000 VNĐ
              </Text>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <Box mb={3}>
                <Image
                  src={"https://res.cloudinary.com/dlbkvfo8l/image/upload/v1664931321/pic-4_wh93ii.jpg"}
                  alt={"pic-1"}
                  width={400}
                  height={220}
                  objectFit={"cover"}
                  layout="responsive"
                />
              </Box>

              <Heading as="h5" size="sm" mb={1}>
                Bánh Hamburger
              </Heading>
              <Text color={"gray.600"} fontWeight={500}>
                40.000 VNĐ
              </Text>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <Box mb={3}>
                <Image
                  src={"https://res.cloudinary.com/dlbkvfo8l/image/upload/v1664931321/pic-4_wh93ii.jpg"}
                  alt={"pic-1"}
                  width={400}
                  height={220}
                  objectFit={"cover"}
                  layout="responsive"
                />
              </Box>

              <Heading as="h5" size="sm" mb={1}>
                Bánh Hamburger
              </Heading>
              <Text color={"gray.600"} fontWeight={500}>
                40.000 VNĐ
              </Text>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <Box mb={3}>
                <Image
                  src={"https://res.cloudinary.com/dlbkvfo8l/image/upload/v1664931321/pic-4_wh93ii.jpg"}
                  alt={"pic-1"}
                  width={400}
                  height={220}
                  objectFit={"cover"}
                  layout="responsive"
                />
              </Box>

              <Heading as="h5" size="sm" mb={1}>
                Bánh Hamburger
              </Heading>
              <Text color={"gray.600"} fontWeight={500}>
                40.000 VNĐ
              </Text>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </Box>
  );
};

const Home: NextPageWithLayout = () => {
  return (
    <Container maxW={"6xl"}>
      <Flex flexDirection={"column"} gap={8}>
        <CategoryList />
        <Filter />
        <ProductCarousel />
        <ProductCarousel />
        <ProductCarousel />
      </Flex>
    </Container>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Home;
