import { z } from "zod";

const createMaterialValidator = z.object({
  name: z.string().min(4),
  codeName: z.string(),
  count: z.string().optional(),
  unit: z.string().optional(),
  description: z.string().optional(),
});

export { createMaterialValidator };
