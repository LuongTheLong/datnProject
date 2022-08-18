import { z } from "zod";

const createItemValidator = z.object({
  idCategory: z.string().min(1),
  name: z.string(),
  price: z.number(),
  description: z.string().nullable(),
});

export { createItemValidator };
