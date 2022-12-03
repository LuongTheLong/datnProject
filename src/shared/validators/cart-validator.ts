import { z } from "zod";
const createCartItemValidator = z.object({
  id: z.string().nullable(),
  productId: z.string().cuid(),
  quantity: z.number().min(1),
  option: z.array(
    z.object({
      id: z.string().cuid(),
      title: z.string(),
      price: z.number(),
    })
  ),
});

const updateCartValidator = z.object({
  id: z.string().cuid(),
  quantity: z.number().min(1).optional(),
  option: z
    .array(
      z.object({
        id: z.string().cuid(),
        title: z.string(),
        price: z.number(),
      })
    )
    .optional(),
});

export { createCartItemValidator, updateCartValidator };
