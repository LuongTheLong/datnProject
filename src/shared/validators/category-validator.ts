import * as z from "zod";

const createCategoryValidator = z.object({ title: z.string().min(1) });

type CreateCategoryValues = z.infer<typeof createCategoryValidator>;

const editCategoryValidator = createCategoryValidator.merge(z.object({ categoryId: z.string().cuid() }));

type EditCategoryValues = z.infer<typeof editCategoryValidator>;

const deleteCategoryValidator = z.object({ id: z.string().cuid() });

const getBySlugValidator = z.object({ slug: z.string().min(1) });

export { createCategoryValidator, editCategoryValidator, deleteCategoryValidator, getBySlugValidator };

export type { CreateCategoryValues, EditCategoryValues };
