import { Heading, Flex, RadioGroup, Radio, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { PAYMENTTYPE } from "@prisma/client";
import { Control, useController } from "react-hook-form";

import { CheckoutFormValues } from "@shared/validators/checkout-validator";

type PaymentProps = {
  control: Control<CheckoutFormValues>;
};

const Payment = ({ control }: PaymentProps) => {
  const { field } = useController({ name: "paymentType", control, defaultValue: "VNPAY" });
  const [paymentType, setPaymentType] = useState<PAYMENTTYPE>(field.value);

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
        <RadioGroup
          value={paymentType}
          onChange={(value: PAYMENTTYPE) => {
            setPaymentType(value);
            field.onChange(value);
          }}
        >
          <Flex direction={"column"} gap={4}>
            <Radio value={"VNPAY"} width={"100%"} position={"relative"}>
              <Text ml={4} fontWeight={600}>
                {`Ví điện tử (VNPAY)`}
              </Text>
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
