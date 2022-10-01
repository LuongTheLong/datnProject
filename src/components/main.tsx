import { Box, Container, Heading, SimpleGrid, Icon, Text, Stack, HStack, VStack } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { trpc } from "src/utils/trpc";
import Image from "next/image";
import LoadingSpinner from "@components/loading-spinner";
import placeholder from "../assets/placeholder.jpg";

// Replace test data with your own

const ProductGrid = () => {
  const { isLoading, data } = trpc.useQuery(["item.get-item"], {
    refetchOnWindowFocus: false,
  });
  trpc.useQuery(["category.get-category"], { refetchOnWindowFocus: false });
  return (
    <>
      <Box p={4} mt={20}>
        <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
          <Heading fontSize={"3xl"}>Fast food </Heading>
          <Text color={"gray.600"} fontSize={"xl"}>
            Nơi này bán đồ ăn ngon hơn người yêu cũ của bạn, hãy quẹo lựa một món sản phẩm mà bạn thích nhất nhé.
          </Text>
        </Stack>
        {isLoading && <LoadingSpinner />}
        {!isLoading && data ?
          (<Container maxW={"6xl"} mt={10}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
              {data.map(item => (
                <HStack key={item.id} align={"top"} onClick={() => {
                  console.log(item.id);
                }}>
                  <VStack align={"start"}>
                    <Image src={item.image || placeholder} width={60} height={60} alt={item.name} />
                    <Text fontWeight={600}>{item.name}</Text>
                    <Text fontWeight={600}>{item.price}</Text>
                    <Text color={"gray.600"}>{item.description}</Text>
                  </VStack>
                </HStack>
              ))}
            </SimpleGrid>
          </Container>) : ""}

      </Box>
    </>
  )
};
export default ProductGrid;
