import * as z from "zod";
import { createProtectedRouter } from "./protected-router";
import { createBillValidator } from "@shared/bill-validator";

export const billRouter = createProtectedRouter()
  .query("get-all-bill", {
    input: z.object({
      idShift: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.bill.findMany({ where: { idShift: input.idShift } });

      return res;
    },
  })
  .mutation("create-bill", {
    input: createBillValidator,
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.bill.create({
        data: input,
      });
      return res;
    },
  })
  .mutation("update-bill", {
    input: z.object({
      id: z.string(),
    }).merge(createBillValidator),
    async resolve({ ctx, input }) {
      const { id, ...rest } = input;
      const res = await ctx.prisma.bill.update({
        data: rest,
        where: {
          id,
        },
      });
      return res;
    },
  })
  .mutation("delete-bill", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.bill.delete({
        where: {
          id: input.id,
        },
      });
      return res;
    },
  });
