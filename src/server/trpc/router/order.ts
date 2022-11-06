import { t, adminRouter, authedProcedure } from "../_app";
import { z } from "zod";
import { PAYMENTSTATUS, PAYMENTTYPE } from "@prisma/client";

const createInputValidator = z.object({
  grandTotal: z.number(),
  paymentType: z.nativeEnum(PAYMENTTYPE),
  paymentStatus: z.nativeEnum(PAYMENTSTATUS),
});

export const orderRouter = t.router({
  create: authedProcedure.input(createInputValidator).mutation(async ({ input, ctx }) => {
    const order = await ctx.prisma.order.create({
      data: {
        grandTotal: input.grandTotal,
        userId: ctx.session.user.id,
        paymentStatus: input.paymentStatus,
        paymentType: input.paymentType,
      },
    });

    return order;
  }),
  update: adminRouter
    .input(createInputValidator.merge(z.object({ orderId: z.string() })))
    .mutation(async ({ input, ctx }) => {
      const updatedCategory = await ctx.prisma.order.update({
        data: { ...input },
        where: {
          id: input.orderId,
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
