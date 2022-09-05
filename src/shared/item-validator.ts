import { z } from "zod";

const itemValidator = z.object({
  idCategory: z.string().min(1),
  name: z.string(),
  price: z.number().min(0),
  description: z.string().nullable(),
});

const createItemValidator = itemValidator.merge(z.object({ image: z.string().nullable() }));

const IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 1048576;

const fileValidator =
  typeof window === "undefined"
    ? z.undefined()
    : z
        .instanceof(FileList)
        .refine(files => !files?.[0] || IMAGE_TYPES.includes(files[0]!.type), "Định dạng không được hỗ trợ")
        .refine(files => !files?.[0] || files[0]!.size < MAX_SIZE, "Kích thước file phải nhỏ hơn 1MB");

const createItemValidatorWithFile = itemValidator.merge(z.object({ files: fileValidator }));

export type ItemValidatorWithFile = z.infer<typeof createItemValidatorWithFile>;

export { createItemValidator, createItemValidatorWithFile };
