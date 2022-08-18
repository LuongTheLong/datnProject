import { z } from "zod";

const createCategoryValidator = z.object({
    name: z.string(),
    codeName: z.string().optional(),
});

export { createCategoryValidator };
