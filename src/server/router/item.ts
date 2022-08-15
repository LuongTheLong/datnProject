import { createRouter } from "./context";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const itemRouter = createProtectedRouter()
  .query("get-item", {
    input: z.object({
      name: z.string().optional(),
      codeName: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.item.findMany({
        include: {
          category: {
            select: {
              name: true,
              codeName: true,
            },
          },
        },
      });
      return res;
    },
  })
  .mutation("create-item", {
    input: z.object({
      idCategory: z.string(),
      name: z.string(),
      codeName: z.string(),
      price: z.number(),
      description: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.item.create({
        data: {
          idCategory: input.idCategory,
          name: input.name,
          codeName: input.codeName,
          price: input.price,
          description: input.description,
        },
      });
      return res;
    },
  })
  .mutation("update-item", {
    input: z.object({
      id: z.string(),
      idCategory: z.string(),
      name: z.string(),
      codeName: z.string(),
      price: z.number(),
      description: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.item.update({
        data: {
          idCategory: input.idCategory,
          name: input.name,
          codeName: input.codeName,
          price: input.price,
          description: input.description,
        },
        where: {
          id: input.id,
        },
      });
      return res;
    },
  })
  .mutation("delete-item", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.item.delete({
        where: {
          id: input.id,
        },
      });
      return res;
    },
  });
