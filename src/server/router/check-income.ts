import * as z from "zod";
import { createProtectedRouter } from "./protected-router";
import { createCheckIncomeValidator } from "@shared/check-income-validator";

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
    input: createCheckIncomeValidator,
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
    }).merge(createCheckIncomeValidator),
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
