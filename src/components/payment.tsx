import { Heading, Flex, RadioGroup, Radio, Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import vnpayLogo from "../assets/vnpay.png";
import { useCheckoutStore } from "src/store/checkout";
import { PAYMENTTYPE } from "@prisma/client";

const Payment = () => {
  const { paymentType, changePaymentType } = useCheckoutStore();

  return (
    <Box
      alignItems={"center"}
      justifyContent={"space-between"}
      border={"1px solid rgb(231, 231, 231)"}
      rounded={"lg"}
      p={4}
    >
      <Heading as="h5" fontSize={18} mb={4}>
        3. Hình thức thanh toán
      </Heading>
      <Flex py={3} px={2} gap={4}>
        <RadioGroup value={paymentType} onChange={value => changePaymentType(value as PAYMENTTYPE)}>
          <Flex direction={"column"} gap={4}>
            <Radio value={"VNPAY"} width={"100%"} position={"relative"}>
              <Box ml={4}>
                <Image src={vnpayLogo} layout={"fixed"} width={150} height={50} alt={"vnpaylogo"} />
              </Box>
            </Radio>

            <Radio value="CASH">
              <Text ml={4} fontWeight={600}>
                Tiền mặt
              </Text>
            </Radio>
          </Flex>
        </RadioGroup>
      </Flex>
    </Box>
  );
};

export default Payment;
