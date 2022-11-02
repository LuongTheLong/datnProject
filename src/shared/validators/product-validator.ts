import { z } from "zod";

const createProductValidator = z.object({
  categoryId: z.string().min(1),
  title: z.string(),
  price: z.number().min(0),
  isSaling: z.boolean().default(false),
  stock: z.number().min(0),
  description: z.string().nullable(),
  image: z.string().optional(),
});

const IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 1048576;

const fileValidator =
  typeof window === "undefined"
    ? z.undefined()
    : z
      .instanceof(FileList)
      .refine(files => !files?.[0] || IMAGE_TYPES.includes(files[0]!.type), "Định dạng không được hỗ trợ")
      .refine(files => !files?.[0] || files[0]!.size < MAX_SIZE, "Kích thước file phải nhỏ hơn 1MB");

const createProductFormValidator = createProductValidator.merge(z.object({ files: fileValidator }));

export type FormProductValidator = z.infer<typeof createProductFormValidator>;

export { createProductValidator };
