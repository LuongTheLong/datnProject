import CommonLayout from "@layout/common-layout";
import { Container, Heading, Grid, GridItem, Box, Text, Button, Spinner, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { trpc } from "src/utils/trpc";

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
                page.products.map(item => (
                  <GridItem key={item.id} w="100%" h="100%">
                    <Box mb={3} rounded={"md"} overflow={"hidden"}>
                      <Image
                        src={item.image!}
                        alt={item.title}
                        width={400}
                        height={220}
                        objectFit={"cover"}
                        layout="responsive"
                      />
                    </Box>

                    <Heading as="h5" size="sm" mb={1}>
                      {item.title}
                    </Heading>
                    <Text color={"gray.600"} fontWeight={500}>
                      {item.price} VNĐ
                    </Text>
                  </GridItem>
                ))
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
