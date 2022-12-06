import { z } from "zod";

const getProductsValidator = z.object({ slug: z.string(), limit: z.number().nullish(), cursor: z.string().nullish() });

const IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 1048576;

const createProductValidator = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(1),
  price: z.number().min(0),
  onSale: z.boolean().default(false),
  stock: z.number().min(0),
  description: z.string().nullable(),
  file:
    typeof window === "undefined"
      ? z.undefined().or(z.string())
      : z
          .instanceof(File)
          .refine(file => !file || IMAGE_TYPES.includes(file.type), "Định dạng không được hỗ trợ")
          .refine(file => !file || file.size < MAX_SIZE, "Kích thước file phải nhỏ hơn 1MB")
          .or(z.string()),
});

export type CreateProductValues = z.infer<typeof createProductValidator>;

export { createProductValidator, getProductsValidator };
