import { Box, Container, Heading, SimpleGrid, Icon, Text, Stack, HStack, VStack } from "@chakra-ui/react";

// Replace test data with your own
const features = Array.apply(null, Array(8)).map(function (x, i) {
  return {
    id: i,
    title: "Lorem ipsum dolor sit amet",
    text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.",
  };
});

const ProductGrid = () => {
  return (
    <Box p={4} mt={20}>
      <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
        <Heading fontSize={"3xl"}>DATA COFFEE HOUSE</Heading>
        <Text color={"gray.600"} fontSize={"xl"}>
          Nơi này bán nước ngon hơn người yêu cũ của bạn, hãy quẹo lựa một món uống mà bạn thích nhất nhé.
        </Text>
      </Stack>

      <Container maxW={"6xl"} mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {features.map(feature => (
            <HStack key={feature.id} align={"top"}>
              <Box color={"green.400"} px={2}></Box>
              <VStack align={"start"}>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text color={"gray.600"}>{feature.text}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ProductGrid;
