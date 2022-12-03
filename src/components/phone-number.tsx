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
import { Control, useController } from "react-hook-form";
import { CheckoutFormValues } from "@shared/validators/checkout-validator";
import { BsTelephone } from "react-icons/bs";

type PhoneNumberProps = {
  control: Control<CheckoutFormValues>;
};

const PhoneNumber = ({ control }: PhoneNumberProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { field, fieldState } = useController({ control, name: "phoneNumber" });
  const [phone, setPhone] = useState(field.value);

  return (
    <>
      <Flex
        py={3}
        px={2}
        alignItems={"center"}
        gap={4}
        onClick={onOpen}
        cursor={"pointer"}
        _hover={{
          bg: "gray.50",
        }}
      >
        <Icon as={BsTelephone} fontSize={24} mr={2} />

        <Text fontSize={16} color={"rgb(25, 25, 25)"} fontWeight={500}>
          {field.value ? field.value : "Nhập số điện thoại"}
        </Text>
        {fieldState.error && (
          <Text display={"block"} fontSize={14} color={"crimson"} fontWeight={400}>
            {fieldState.error.message}
          </Text>
        )}
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
                onChange={event => {
                  setPhone(event.target.value);
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Đóng</Button>
              <Button
                ml={2}
                colorScheme="blue"
                onClick={() => {
                  field.onChange(phone);
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
