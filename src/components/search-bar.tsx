import { BsSearch } from "react-icons/bs";
import { InputGroup, InputLeftElement, Input, Text, Box, useDisclosure, useOutsideClick } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState, useRef } from "react";
import { useDebounce } from "@utils/hooks/use-debounce";
import { trpc } from "@utils/trpc";
import LoadingSpinner from "./loading-spinner";
import AddToCartModal from "./add-to-cart";
import { Product } from "@prisma/client";

type SearchItemProps = {
  product: Product;
};

const SearchItem = ({ product }: SearchItemProps) => {
  const { onClose, isOpen, onOpen } = useDisclosure();

  return (
    <>
      <Text fontSize={15} cursor={"pointer"} onClick={onOpen} _hover={{ bg: "gray.50" }} px={4} py={2}>
        {product.title}
      </Text>
      {isOpen && <AddToCartModal isOpen={isOpen} onClose={onClose} item={product} />}
    </>
  );
};

type InputSearchProps = {
  setSearchKey: Dispatch<SetStateAction<string>>;
  onOpen: () => void;
};

const InputSearch = ({ setSearchKey, onOpen }: InputSearchProps) => {
  const [value, setValue] = useState("");
  const debounceCallback = useDebounce(() => setSearchKey(value));

  return (
    <InputGroup onFocus={() => onOpen()}>
      <InputLeftElement>
        <BsSearch fontSize={17} />
      </InputLeftElement>
      <Input
        rounded={"md"}
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
        value={value}
        onChange={event => {
          setValue(event.target.value);
          debounceCallback();
        }}
      />
    </InputGroup>
  );
};

const SearchBar = () => {
  const [searchKey, setSearchKey] = useState("");
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { isLoading, data } = trpc.product.searchProduct.useQuery(
    { key: searchKey },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  return (
    <>
      {isOpen && (
        <Box
          position={"fixed"}
          onClick={onClose}
          zIndex={2}
          width={"100%"}
          inset={0}
          bg={"rgba(0,0,0,0.2)"}
          cursor={"pointer"}
        ></Box>
      )}
      <Box maxW={600} position="relative" zIndex={3}>
        <InputSearch onOpen={onOpen} setSearchKey={setSearchKey} />

        {searchKey !== "" && isOpen && (
          <Box
            position={"absolute"}
            width={"100%"}
            left={0}
            transform={"translateY(6px)"}
            bg={"white"}
            shadow={"md"}
            rounded={"md"}
            overflow={"auto"}
            maxHeight={300}
          >
            {data && data.map(product => <SearchItem product={product} key={product.id} />)}
            {!isLoading && data?.length === 0 && (
              <Text px={4} py={2} fontSize={14}>
                Không tìm thấy kết quả nào
              </Text>
            )}
            {isLoading && <LoadingSpinner my={4} size={"sm"} />}
          </Box>
        )}
      </Box>
    </>
  );
};

export default SearchBar;
