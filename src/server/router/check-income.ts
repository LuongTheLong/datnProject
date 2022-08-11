import * as z from "zod";
import { createProtectedRouter } from "./protected-router";

export const incomeRouter = createProtectedRouter()
  .query("get-check-income", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.income.findMany({ where: { id: input.id } });
      return res;
    },
  })
  .mutation("create-check-income", {
    input: z.object({
      idShift: z.string(),
      startIncome: z.number(),
      income: z.number(),
      totalDecrease: z.number(),
      feeService: z.number(),
      vat: z.number(),
      totalBills: z.number(),
      outcome: z.number(),
      moneyRemaining: z.number(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.income.create({
        data: input,
      });
      return res;
    },
  })
  .mutation("update-incomes", {
    input: z.object({
      id: z.string(),
      idShift: z.string(),
      startIncome: z.number(),
      income: z.number(),
      totalDecrease: z.number(),
      feeService: z.number(),
      vat: z.number(),
      totalBills: z.number(),
      outcome: z.number(),
      moneyRemaining: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { id, ...rest } = input;
      const res = await ctx.prisma.income.update({
        data: rest,
        where: {
          id,
        },
      });
      return res;
    },
  })
  .mutation("delete-incomes", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.income.delete({
        where: {
          id: input.id,
        },
      });
      return res;
    },
  });
