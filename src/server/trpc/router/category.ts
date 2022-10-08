import { t, adminRouter } from "../_app";
import { z } from "zod";
import { slugGenerator } from "@server/utils/common";

const categoryInputValidator = z.object({ title: z.string() });

export const categoryRouter = t.router({
  create: adminRouter.input(categoryInputValidator).mutation(async ({ input, ctx }) => {
    const category = await ctx.prisma.category.create({ data: { ...input, slug: slugGenerator(input.title) } });

    return category;
  }),
  update: adminRouter
    .input(categoryInputValidator.merge(z.object({ categoryId: z.string() })))
    .mutation(async ({ input, ctx }) => {
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
  delete: adminRouter.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
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
  getBySlug: t.procedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
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
          },
        },
      },
    });

    return products;
  }),
});
