import {
  Button,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsTelephone } from "react-icons/bs";
import { useCheckoutStore } from "src/store/checkout";

const PhoneNumber = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { changePhone, phoneNumber } = useCheckoutStore();
  const [phone, setPhone] = useState(phoneNumber);

  return (
    <>
      <Flex py={3} px={2} alignItems={"center"} gap={4} onClick={onOpen} cursor={"pointer"}>
        <Icon as={BsTelephone} fontSize={24} mr={2} />

        <Text fontSize={16} color={"rgb(25, 25, 25)"} fontWeight={500}>
          {phoneNumber ? phoneNumber : "Số điện thoại"}
        </Text>
      </Flex>

      {isOpen && (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Số điện thoại</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Số điện thoại"
                size="md"
                value={phone}
                onChange={event => setPhone(event.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Đóng</Button>
              <Button
                ml={2}
                colorScheme="blue"
                onClick={() => {
                  changePhone(phone);
                  onClose();
                }}
              >
                Xác nhận
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default PhoneNumber;
