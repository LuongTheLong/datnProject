import { NextPageWithLayout } from "./_app";
import { useRef } from "react";
import CommonLayout from "@layout/common-layout";
import {
  Flex,
  Container,
  Text,
  IconButton,
  Heading,
  Box,
  Icon,
  Divider,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { Navigation } from "swiper";
import { Product } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import NextLink from "next/link";
import CaptionCarousel from "../components/slide";
import AddToCartModal from "@components/add-to-cart";
import { Swiper, SwiperSlide } from "swiper/react";
import { InferOutput } from "src/utils/trpc";
import { formatPrice } from "@utils/common";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// Import Swiper styles
import "swiper/css";

import Image from "next/legacy/image";
import FoodServe from "../assets/food-serve.svg";
import Fresh from "../assets/fresh.svg";
import Discount from "../assets/discount.svg";
import FoodPlate from "../assets/food-plate.png";
import LoadingSpinner from "@components/loading-spinner";

const FEATURES = [
  {
    id: 1,
    title: " Giá",
    text: "Giá thành rẻ, hợp với túi tiền học sinh, sinh viên.",
    image: Discount,
  },
  {
    id: 2,
    title: " Dịch vụ",
    text: "Dịch vụ nhanh chóng, chuyên nghiệp, lịch sự.",
    image: FoodServe,
  },
  {
    id: 3,
    title: " Sản phẩm",
    text: "Sản phẩm tươi, ngon, sạch như món ăn của mẹ bạn nấu.",
    image: Fresh,
  },
];

const QUALITIES = [
  {
    id: 1,
    title: "Ngon",
  },
  {
    id: 2,
    title: "Sạch",
  },
  {
    id: 3,
    title: "Đẹp",
  },
];

type CategoryProductsOutput = InferOutput["category"]["getProductsByCategories"][number];

type ProductCardProps = {
  product: Product;
  slug: string;
  title: string;
};
const ProductCard = (props: ProductCardProps) => {
  const { product, slug, title } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        boxShadow={"0px 6px 15px rgb(1 15 28 / 6%)"}
        rounded={"lg"}
        overflow={"hidden"}
        height={"100%"}
      >
        <Box overflow={"hidden"}>
          <Image
            src={product.image}
            alt={product.title}
            objectFit={"cover"}
            width={100}
            height={100}
            layout="responsive"
          />
        </Box>
        <Flex flex={1} direction={"column"} gap={2} p={2} textAlign={"center"}>
          <Text
            textAlign={"center"}
            _hover={{
              color: "crimson",
            }}
            cursor={"pointer"}
            width={"fit-content"}
            mx={"auto"}
            as={"span"}
            fontSize={{ base: "sm", lg: "md" }}
          >
            <NextLink href={{ pathname: "/[category]", query: { category: slug } }}>{title}</NextLink>
          </Text>

          {/* <Flex alignItems={"center"} justifyContent="center">
            {new Array(5).fill("").map((_, idx) => (
              <Icon key={idx} as={AiFillStar} w={5} h={5} color={"orange.300"} />
            ))}
          </Flex> */}
          <Heading textAlign={"center"} as="h5" size={{ base: "sm", lg: "md" }}>
            {product.title}
          </Heading>

          <Box as="div" mt={"auto"}>
            {!product.onSale ? (
              <Text textAlign={"center"} fontSize={16} fontWeight={600} color={"black"}>
                {formatPrice(product.price)} VNĐ
              </Text>
            ) : (
              <Text textAlign={"center"} fontSize={16} fontWeight={600} color={"red"}>
                {formatPrice(product.price)} VNĐ
              </Text>
            )}

            <Button mt={2} colorScheme={"red"} onClick={onOpen} w={"full"}>
              Thêm vào giỏ
            </Button>
          </Box>
        </Flex>
      </Box>
      {isOpen && <AddToCartModal isOpen={isOpen} item={product} onClose={onClose} />}
    </>
  );
};

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
            style={{ padding: "20px 0" }}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            navigation={{
              prevEl: navigationPrevRef.current!, // Assert non-null
              nextEl: navigationNextRef.current!, // Assert non-null
            }}
            breakpoints={{
              768: {
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
                <SwiperSlide key={product.id} style={{ height: "100%" }}>
                  <ProductCard slug={slug} title={title} product={product} />
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
        <Flex alignItems={"flex-start"} gap={6} mt={20} mb={100} direction={{ base: "column", lg: "row" }}>
          {FEATURES.map(feature => (
            <Flex
              key={feature.id}
              flex={1}
              alignItems="center"
              _notLast={{
                borderRight: { base: "none", lg: "1px dashed #CBD5E0" },
              }}
            >
              <Box
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
                minWidth={"80px"}
                width={"80px"}
                height={"80px"}
                rounded={"full"}
                bg={"#faf7f2"}
                mr={4}
              >
                <Image alt={feature.title} src={feature.image} layout={"fixed"} width={50} height={50} />
              </Box>
              <Flex flexDirection={"column"} gap={2}>
                <Heading as="h4" size={"md"}>
                  {feature.title}
                </Heading>
                <Text color={"gray.500"}>{feature.text}</Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Container>

      <Box py={20} bgColor={"#faf7f2"} mb={20}>
        <Container maxW={"6xl"}>
          <Flex alignItems={"center"} gap={2} position={"relative"} direction={{ base: "column", lg: "row" }}>
            <Box flex={1} position="relative" width={"100%"} height={"100%"}>
              <Image src={FoodPlate} alt={"food-plate"} layout={"responsive"} objectFit="cover" priority={true} />
            </Box>
            <Box flex={1}>
              <Heading as="h2" size="xl" mb={4}>
                Món ăn thực sự ngon sẽ được phục vụ tới{" "}
                <Text color={"crimson"} as={"span"}>
                  tay của bạn
                </Text>
              </Heading>
              <Text fontSize={18} color={"gray.600"} mb={4}>
                Nếu bạn thực sự muốn kết bạn, hãy đi đến bàn của ai đó và ngồi ăn với anh ta. Người mà cho bạn đồ ăn thì
                cũng có thể cho bạn trái tim của họ.
              </Text>

              <Flex flexDirection={"column"} gap={2}>
                {QUALITIES.map(quality => (
                  <Text key={quality.id} fontWeight={600}>
                    <Icon as={BsFillPatchCheckFill} verticalAlign={"middle"} w={4} h={4} color={"crimson"} mr={2} />
                    {quality.title}
                  </Text>
                ))}
              </Flex>

              <Divider my={4} />

              <Text fontStyle={"italic"} fontSize={18} mb={4}>
                {'"Yêu thương có thể lấp đầy hết tất cả chỉ trừ… bao tử.."'}
              </Text>

              {/* <Flex>
                <Box width={50} height={50} position={"relative"} rounded={"full"} overflow={"hidden"} mr={4}>
                  <Image src={Ramsay} layout={"fill"} alt={"ramsay"} />
                </Box>
                <Flex direction={"column"}>
                  <Text fontWeight={"bold"}>Lương Thế Long</Text>
                  <Text>CEO Long Food</Text>
                </Flex>
              </Flex> */}
            </Box>
          </Flex>
        </Container>
      </Box>

      <Container maxW={"6xl"}>
        <Heading as="h2" size="2xl" textAlign={"center"} mb={6}>
          Thực đơn
        </Heading>

        <Flex flexDirection={"column"} gap={8}>
          {itemsQuery.isLoading && <LoadingSpinner mb={10} />}
          {!itemsQuery.isLoading && itemsQuery.data && (
            <>
              {/* <Flex alignItems={"center"} gap={6} justifyContent="center">
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
              </Flex> */}
              {/* <Filter /> */}

              {itemsQuery.data.map(category => (
                <ProductCarousel key={category.id} {...category} />
              ))}
            </>
          )}
        </Flex>
      </Container>
    </>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Home;
