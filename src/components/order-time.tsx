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

import { BiTimeFive } from "react-icons/bi";
import { BsCheckCircleFill } from "react-icons/bs";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { deliverTime } from "src/constant/time";
import { useCheckoutStore } from "src/store/checkout";
import dayjs from "dayjs";

const OrderTime = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { changeTime, time } = useCheckoutStore();

  const isASAP = time === "" ? "2px solid black" : "1px solid black";
  const isScheduled = time ? "2px solid black" : "1px solid black";

  const handleTime = (time: string) => {
    changeTime(time);
  };

  const formatTime = ({ hour, minute }: { hour: number; minute: number }) => {
    return `${hour}:${minute === 0 ? "00" : minute}`;
  };

  const isScheduleAvailable = dayjs().get("hour") < 22;

  return (
    <>
      <Flex py={3} px={2} gap={4}>
        <Icon as={BiTimeFive} fontSize={24} mr={2} />
        <Box flex={1}>
          <Flex mb={4} alignItems={"center"} justifyContent={"space-between"} fontSize={16} fontWeight={500}>
            <Text>Thời gian nhận hàng</Text>
            <Text>{time === "" ? "15-20 phút" : `${time} hôm nay`}</Text>
          </Flex>

          <Flex alignItems={"center"} gap={4}>
            <Flex
              onClick={() => handleTime("")}
              px={3}
              py={2}
              border={isASAP}
              rounded={"lg"}
              gap={2}
              cursor={"pointer"}
            >
              <Box>
                <Text mr={2} fontSize={16} fontWeight={600}>
                  Tiêu chuẩn
                </Text>
                <Text fontSize={14} fontWeight={400}>
                  15-20 phút
                </Text>
              </Box>
              <Icon as={time === "" ? BsCheckCircleFill : MdOutlineRadioButtonUnchecked} fontSize={16} mt={1} />
            </Flex>

            <Flex
              px={3}
              py={2}
              border={isScheduled}
              rounded={"lg"}
              gap={2}
              cursor={"pointer"}
              onClick={onOpen}
              opacity={isScheduleAvailable ? 1 : 0.5}
              pointerEvents={isScheduleAvailable ? "auto" : "none"}
            >
              <Box>
                <Text mr={2} fontSize={16} fontWeight={600}>
                  Đặt hẹn
                </Text>
                <Text fontSize={14} fontWeight={400}>
                  {time ? time : "Chọn thời gian"}
                </Text>
              </Box>
              <Icon as={time ? BsCheckCircleFill : MdOutlineRadioButtonUnchecked} fontSize={16} mt={1} />
            </Flex>
          </Flex>
        </Box>
      </Flex>
      {isOpen && (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Hẹn giờ nhận đơn</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                {deliverTime.map(item =>
                  item.from.hour < dayjs().get("hour") ||
                  (item.from.hour === dayjs().get("hour") && item.from.minute < dayjs().get("minute") + 10) ? null : (
                    <GridItem
                      onClick={() => {
                        handleTime(`${formatTime(item.from)} - ${formatTime(item.to)}`);
                        onClose();
                      }}
                      w="100%"
                      textAlign={"center"}
                      bg="rgb(231, 231, 231)"
                      p={2}
                      fontWeight={"semibold"}
                      rounded={"md"}
                      cursor="pointer"
                    >{`${formatTime(item.from)} - ${formatTime(item.to)}`}</GridItem>
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
