import { Modal, Icon, ModalBody, ModalContent, ModalOverlay, useDisclosure, Text, Flex } from "@chakra-ui/react";
import SearchBar from "./search-bar";

import { BsSearch } from "react-icons/bs";

const MobileSearchBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex onClick={onOpen} alignItems={"center"} cursor={"pointer"} bg={"gray.50"} rounded={"md"} px={4} py={2}>
        <Icon mr={2} as={BsSearch} onClick={onOpen} w={4} h={4} />
        <Text fontSize={{ base: 13, md: 15 }} fontWeight={"semibold"}>
          Tìm kiếm
        </Text>
      </Flex>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent p={0}>
            <ModalBody>
              <SearchBar />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MobileSearchBar;
