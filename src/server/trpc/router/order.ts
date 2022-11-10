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

    // const orderItems = await ctx.prisma.order.findMany({
    //   where: {
    //     userId: ctx.session.user.id,
    //   },
    // });

    // await ctx.prisma.order.createMany({
    //   data: orderItems,
    // });

    return order;
  }),
  update: authedProcedure
    .input(createInputValidator.merge(z.object({ orderId: z.string() })))
    .mutation(async ({ input, ctx }) => {
      const updatedOrder = await ctx.prisma.order.update({
        data: { ...input },
        where: {
          id: input.orderId,
        },
      });

      return updatedOrder;
    }),
  getAll: t.procedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany({});

    return orders;
  }),
  delete: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const deletedOrder = ctx.prisma.order.delete({
      where: {
        id: input.id,
      },
    });

    return deletedOrder;
  }),
});
