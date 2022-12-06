import { BsSearch } from "react-icons/bs";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

const SearchBar = () => {
  const {} = useDisclosure();

  return (
    <Box minW={350} maxW={400} position="relative">
      <InputGroup>
        <InputLeftElement>
          <BsSearch fontSize={17} />
        </InputLeftElement>
        <Input
          rounded={"full"}
          fontSize={16}
          _placeholder={{ fontWeight: "medium", fontSize: 16 }}
          type="text"
          placeholder="Tìm món ăn"
          fontWeight={"medium"}
          _hover={{ borderColor: "gray.300" }}
          focusBorderColor="crimson"
          borderColor={"transparent"}
          bg={"rgb(247, 247, 247)"}
          maxW={400}
        />
      </InputGroup>
      <Box bg={"rgb(247, 247, 247)"} rounded={"full"} position={"absolute"} w={"full"}>
        Hello
      </Box>
    </Box>
  );
};

export default SearchBar;
