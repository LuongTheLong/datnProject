import { z } from "zod";

const createCategoryValidator = z.object({
  name: z.string(),
});

export { createCategoryValidator };
