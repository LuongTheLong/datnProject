import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const shiftRouter = createProtectedRouter()
  .query("get-shift", {
    input: z.object({
      idWorker: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.shift.findMany({ where: { idWorker: input.idWorker } });
      return res;
    },
  })
  .mutation("create-shift", {
    input: z.object({
      idWorker: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.shift.create({
        data: input,
      });
      return res;
    },
  })
  .mutation("update-shift", {
    input: z.object({
      id: z.string(),
      idWorker: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id, ...rest } = input;
      const res = await ctx.prisma.shift.update({
        data: rest,
        where: {
          id,
        },
      });
      return res;
    },
  })
  .mutation("delete-shift", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.shift.delete({
        where: {
          id: input.id,
        },
      });
      return res;
    },
  });
