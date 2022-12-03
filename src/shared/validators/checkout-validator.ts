import * as z from "zod";
import { PAYMENTTYPE, ORDERTYPE } from "@prisma/client";
import { isTimeAvailable } from "@utils/time";

const checkoutValidator = z.object({
  phoneNumber: z.string().min(8, "Số điện thoại không được để trống"),
  orderType: z.nativeEnum(ORDERTYPE, {
    required_error: "Vui lòng chọn thời gian nhận hàng",
  }),
  paymentType: z.nativeEnum(PAYMENTTYPE),
  deliverTime: z
    .object({
      from: z.string(),
      to: z.string(),
    })
    .refine(value => {
      if (value.from === "" && value.to === "") {
        return true;
      }

      return isTimeAvailable(value.from) ? true : false;
    }, "Thời gian không hợp lệ, vui lòng chọn lại"),
});

type CheckoutFormValues = z.infer<typeof checkoutValidator>;

export type { CheckoutFormValues };
export { checkoutValidator };
