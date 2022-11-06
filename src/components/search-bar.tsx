import { BsSearch } from "react-icons/bs";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";

const SearchBar = () => {
  return (
    <InputGroup minW={300} maxW={400}>
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
  );
};

export default SearchBar;
