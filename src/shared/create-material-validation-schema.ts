import { z } from "zod";

const createMaterialValidator = z.object({
  name: z.string().min(4),
  codeName: z.string(),
  count: z.string().default("0"),
  unit: z.string().nullable(),
  description: z.string().nullable(),
});

export { createMaterialValidator };
