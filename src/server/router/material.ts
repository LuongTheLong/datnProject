import { createRouter } from "./context";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { slugGenerator, nameGenerator } from "../utils/common";

export const materialRouter = createProtectedRouter()
  .query("get-material", {
    input: z.object({
      name: z.string().optional(),
      codeName: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.material.findMany();
      return res;
    },
  })
  .mutation("create-material", {
    input: z.object({
      name: z.string(),
      codeName: z.string(),
      count: z.number().optional(),
      unit: z.string().optional(),
      description: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const code = slugGenerator(input.name);
      const res = await ctx.prisma.material.create({
        data: { ...input, codeName: code },
      });
      return res;
    },
  })
  .mutation("update-material", {
    input: z.object({
      id: z.string(),
      name: z.string(),
      codeName: z.string(),
      count: z.number().optional(),
      unit: z.string().optional(),
      description: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const { id, ...rest } = input;

      const res = await ctx.prisma.material.update({
        data: rest,
        where: {
          id,
        },
      });
      return res;
    },
  })
  .mutation("delete-material", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.material.delete({
        where: {
          id: input.id,
        },
      });
      return res;
    },
  });
