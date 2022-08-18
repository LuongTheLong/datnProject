import { z } from "zod";

const createItemValidator = z.object({
    idCategory: z.string(),
    name: z.string(),
    codeName: z.string(),
    price: z.number(),
    description: z.string().optional(),
});

export { createItemValidator };
