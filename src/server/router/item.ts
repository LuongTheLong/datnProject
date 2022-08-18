import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { createItemValidator } from "@shared/item-validator";

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
    input: createItemValidator,
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
    }).merge(createItemValidator),
    async resolve({ ctx, input }) {
      const { id, ...rest } = input;
      const res = await ctx.prisma.item.update({
        data: rest,
        where: {
          id,
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
