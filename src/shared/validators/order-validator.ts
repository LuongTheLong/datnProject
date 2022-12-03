import { PAYMENTTYPE, ORDERTYPE } from "@prisma/client";
import { z } from "zod";
const createOrderValidator = z.object({
  grandTotal: z.number(),
  paymentType: z.nativeEnum(PAYMENTTYPE),
  phoneNumber: z.string().min(1),
  orderType: z.nativeEnum(ORDERTYPE),
  deliverTime: z.object({
    from: z.string(),
    to: z.string(),
  }),
  products: z.array(
    z.object({
      total: z.number(),
      productId: z.string(),
      price: z.number(),
      quantity: z.number(),
      option: z.array(
        z.object({
          id: z.string().cuid(),
          title: z.string().min(1),
          price: z.number(),
        })
      ),
    })
  ),
});

const getOrdersValidator = z.object({ limit: z.number().nullish(), cursor: z.string().nullish() });

export { createOrderValidator, getOrdersValidator };
