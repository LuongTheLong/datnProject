import {
  Flex,
  Icon,
  Box,
  Text,
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { BsCheckCircleFill } from "react-icons/bs";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { deliverTime } from "src/constant/time";
import { Control, useController } from "react-hook-form";
import { ORDERTYPE } from "@prisma/client";
import { CheckoutFormValues } from "@shared/validators/checkout-validator";
import { formatTime, customTime, isTimeAvailable, isStoreOpened } from "@utils/time";

type OrderTimeProps = {
  control: Control<CheckoutFormValues>;
  isStoreOpened: boolean;
};

const OrderTime = ({ control, isStoreOpened }: OrderTimeProps) => {
  const deliverTimeController = useController({ control, name: "deliverTime" });
  const orderTypeController = useController({ control, name: "orderType" });

  const [date, setDate] = useState(deliverTimeController.field.value);
  const [orderType, setOrderType] = useState<ORDERTYPE>(orderTypeController.field.value);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const isNow = orderType === "NOW" ? "2px solid black" : "1px solid black";
  const isScheduled = orderType === "SCHEDULE" ? "2px solid black" : "1px solid black";

  const onChangeScheduleTime = (params: { from: string; to: string }) => {
    setDate(params);
    setOrderType("SCHEDULE");
    deliverTimeController.field.onChange(params);
    orderTypeController.field.onChange("SCHEDULE");
  };

  const onChangeNowTime = () => {
    setOrderType("NOW");
    orderTypeController.field.onChange("NOW");
    deliverTimeController.field.onChange({
      from: "",
      to: "",
    });
  };

  return (
    <>
      <Flex py={3} px={2} gap={4}>
        <Icon as={BiTimeFive} fontSize={24} mr={2} />
        <Box flex={1}>
          <Flex mb={4} alignItems={"center"} justifyContent={"space-between"} fontSize={16} fontWeight={500}>
            <Text>Thời gian nhận hàng</Text>
            {orderType === "NOW" && <Text>15-20 phút</Text>}
            {orderType === "SCHEDULE" && (
              <Text>
                {formatTime(date.from)} - {formatTime(date.to)} hôm nay
              </Text>
            )}
          </Flex>

          <Flex alignItems={"center"} gap={4}>
            <Flex
              onClick={onChangeNowTime}
              px={3}
              py={2}
              border={isNow}
              rounded={"lg"}
              gap={2}
              cursor={"pointer"}
              pointerEvents={isStoreOpened ? "auto" : "none"}
              opacity={isStoreOpened ? 1 : 0.5}
            >
              <Box>
                <Text mr={2} fontSize={16} fontWeight={600}>
                  Tiêu chuẩn
                </Text>
                <Text fontSize={14} fontWeight={400}>
                  15-20 phút
                </Text>
              </Box>
              <Icon as={orderType === "NOW" ? BsCheckCircleFill : MdOutlineRadioButtonUnchecked} fontSize={16} mt={1} />
            </Flex>

            <Flex px={3} py={2} border={isScheduled} rounded={"lg"} gap={2} cursor={"pointer"} onClick={onOpen}>
              <Box>
                <Text mr={2} fontSize={16} fontWeight={600}>
                  Đặt hẹn
                </Text>
                <Text fontSize={14} fontWeight={400}>
                  {orderType === "SCHEDULE" ? `${formatTime(date.from)} - ${formatTime(date.to)}` : "Chọn thời gian"}
                </Text>
              </Box>
              <Icon
                as={orderType === "SCHEDULE" ? BsCheckCircleFill : MdOutlineRadioButtonUnchecked}
                fontSize={16}
                mt={1}
              />
            </Flex>
          </Flex>
          {orderTypeController.fieldState.error && (
            <Text mt={2} display={"block"} fontSize={14} color={"crimson"} fontWeight={400}>
              {orderTypeController.fieldState.error.message}
            </Text>
          )}

          {deliverTimeController.fieldState.error && (
            <Text mt={2} display={"block"} fontSize={14} color={"crimson"} fontWeight={400}>
              {deliverTimeController.fieldState.error.message}
            </Text>
          )}
        </Box>
      </Flex>
      {isOpen && (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Hẹn giờ nhận đơn</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflowY={"auto"} maxHeight={"440px"}>
              <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={2}>
                {deliverTime.map((time, idx) =>
                  !isTimeAvailable({ hour: time.from.hour, minute: time.from.minute }) ? null : (
                    <GridItem
                      key={idx}
                      onClick={() => {
                        onChangeScheduleTime({
                          from: customTime(time.from).toISOString(),
                          to: customTime(time.to).toISOString(),
                        });
                        onClose();
                      }}
                      w="100%"
                      textAlign={"center"}
                      bg="rgb(231, 231, 231)"
                      p={2}
                      fontSize={{ base: 14, lg: 16 }}
                      fontWeight={"semibold"}
                      rounded={"md"}
                      cursor="pointer"
                      _hover={{
                        bg: "gray.200",
                      }}
                    >{`${customTime(time.from).format("HH:mm")} - ${customTime(time.to).format("HH:mm")}`}</GridItem>
                  )
                )}
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default OrderTime;
