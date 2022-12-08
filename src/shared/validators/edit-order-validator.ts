import * as z from "zod";
import { PAYMENTSTATUS } from "@prisma/client";

const EditOrderValidator = z.object({
  paymentStatus: z.nativeEnum(PAYMENTSTATUS),
});

export type EditOrderFormValues = z.infer<typeof EditOrderValidator>;

export { EditOrderValidator };
