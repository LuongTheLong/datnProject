import { t, adminRouter, authedProcedure } from "../_app";
import { z } from "zod";
import { PAYMENTSTATUS, PAYMENTTYPE, Prisma } from "@prisma/client";

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

    const cartItems = await ctx.prisma.cart.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        product: {
          select: {
            price: true,
          },
        },
      },
    });

    const orderItems = cartItems.map(item => {
      const option = item.option as Prisma.JsonArray;
      const { productId, quantity, product } = item;

      return {
        option,
        productId,
        quantity,
        price: product.price,
        orderId: order.id,
      };
    });

    await ctx.prisma.orderDetail.createMany({
      data: orderItems,
    });

    await ctx.prisma.cart.deleteMany({
      where: {
        userId: ctx.session.user.id,
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
});
