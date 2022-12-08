import { t, adminRouter } from "../_app";
import {
  createCategoryValidator,
  editCategoryValidator,
  deleteCategoryValidator,
  getBySlugValidator,
} from "@shared/validators/category-validator";
import { slugGenerator } from "@server/utils/common";

export const categoryRouter = t.router({
  create: adminRouter.input(createCategoryValidator).mutation(async ({ input, ctx }) => {
    const category = await ctx.prisma.category.create({ data: { ...input, slug: slugGenerator(input.title) } });

    return category;
  }),
  update: adminRouter.input(editCategoryValidator).mutation(async ({ input, ctx }) => {
    const updatedCategory = await ctx.prisma.category.update({
      data: { ...input, slug: slugGenerator(input.title) },
      where: {
        id: input.categoryId,
      },
    });

    return updatedCategory;
  }),
  getAll: t.procedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      where: {
        isDeleted: false,
      },
    });

    return categories;
  }),
  delete: adminRouter.input(deleteCategoryValidator).mutation(async ({ ctx, input }) => {
    const deletedCategory = ctx.prisma.category.update({
      where: {
        id: input.id,
      },
      data: {
        isDeleted: true,
      },
    });

    return deletedCategory;
  }),
  getBySlug: t.procedure.input(getBySlugValidator).query(async ({ ctx, input }) => {
    const category = await ctx.prisma.category.findFirst({
      where: {
        slug: input.slug,
        isDeleted: false,
      },
    });

    return category;
  }),
  getProductsByCategories: t.procedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.category.findMany({
      include: {
        products: {
          take: 6,
          where: {
            isDeleted: false,
            stock: {
              gt: 0,
            },
          },
        },
      },
    });

    return products;
  }),
});
