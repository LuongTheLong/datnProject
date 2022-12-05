import * as z from "zod";

const formValidator = z.object({
  name: z.string().min(2),
  phoneNumber: z.string().min(1),
});

type FormValues = z.infer<typeof formValidator>;

export { formValidator };
export type { FormValues };
