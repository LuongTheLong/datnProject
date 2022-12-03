import * as z from "zod";

const optionsSchema = z.object({
  quantity: z.number(),
  size: z.array(z.object({ id: z.string(), title: z.string(), price: z.number() })).optional(),
  sauce: z.array(z.object({ id: z.string(), title: z.string(), price: z.number() })).optional(),
  ice: z.array(z.object({ id: z.string(), title: z.string(), price: z.number() })).optional(),
  topping: z.array(z.object({ id: z.string(), title: z.string(), price: z.number() })).optional(),
  cutlery: z.array(z.object({ id: z.string(), title: z.string(), price: z.number() })).optional(),
  chili: z.array(z.object({ id: z.string(), title: z.string(), price: z.number() })).optional(),
});
type OptionCategory = "size" | "sauce" | "ice" | "topping" | "cutlery" | "chili";
type ProductOptions = z.infer<typeof optionsSchema>;

export { optionsSchema };
export type { ProductOptions, OptionCategory };
