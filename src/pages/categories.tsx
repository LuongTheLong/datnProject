import CommonLayout from "@layout/common-layout";
import { Container, Heading, Grid, GridItem, Box, Text, Button } from "@chakra-ui/react";
import Image from "next/image";
import { NextPageWithLayout } from "./_app";

const Categories: NextPageWithLayout = () => {
  return (
    <Container maxW={"6xl"} my={8}>
      <Heading as="h2" size="2xl" mb={8}>
        Thức ăn nhanh
      </Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem w="100%" h="100%">
          <Box mb={3} rounded={"md"} overflow={"hidden"}>
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
        </GridItem>
        <GridItem w="100%" h="100%">
          <Box mb={3} rounded={"md"} overflow={"hidden"}>
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
        </GridItem>
        <GridItem w="100%" h="100%">
          <Box mb={3} rounded={"md"} overflow={"hidden"}>
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
        </GridItem>
        <GridItem w="100%" h="100%">
          <Box mb={3} rounded={"md"} overflow={"hidden"}>
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
        </GridItem>
        <GridItem w="100%" h="100%">
          <Box mb={3} rounded={"md"} overflow={"hidden"}>
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
        </GridItem>
      </Grid>

      <Box textAlign={"center"} mt={6}>
        <Button bg={"gray.100"} rounded={"full"}>
          Xem thêm
        </Button>
      </Box>
    </Container>
  );
};

Categories.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};
export default Categories;
