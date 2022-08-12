import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const categoryRouter = createProtectedRouter()
  .query("get-category", {
    input: z.object({
      name: z.string().optional(),
      codeName: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.category.findMany({
        include: {
          items: {
            select: {
              name: true,
              price: true,
              description: true,
            },
          },
        },
      });
      return res;
    },
  })
  .mutation("create-category", {
    input: z.object({
      name: z.string(),
      codeName: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.category.create({
        data: {
          name: input.name,
          codeName: input.codeName,
        },
      });
      return res;
    },
  })
  .mutation("update-category", {
    input: z.object({
      id: z.string(),
      name: z.string(),
      codeName: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.category.update({
        data: {
          name: input.name,
          codeName: input.codeName,
        },
        where: {
          id: input.id,
        },
      });
      return res;
    },
  })
  .mutation("delete-category", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.category.delete({
        where: {
          id: input.id,
        },
      });
      return res;
    },
  });
