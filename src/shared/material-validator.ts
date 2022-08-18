import { z } from "zod";

const createMaterialValidator = z.object({
  name: z.string().min(1),
  count: z.number().default(0),
  unit: z.string(),
  description: z.string().nullable(),
});

export { createMaterialValidator };
