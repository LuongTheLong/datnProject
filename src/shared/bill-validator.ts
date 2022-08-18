import { z } from "zod";

const createBillValidator = z.object({
    numberDesk: z.string(),
      idShift: z.string(),
      vat: z.number(),
      coupon: z.number(),
      totalCount: z.number(),
});

export { createBillValidator };
