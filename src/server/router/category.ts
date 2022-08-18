import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { createCategoryValidator } from "@shared/category-validator";
import { slugGenerator } from "../utils/common";

export const categoryRouter = createProtectedRouter()
  .query("get-category", {
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.category.findMany();
      return res;
    },
  })
  .mutation("create-category", {
    input: createCategoryValidator,
    async resolve({ ctx, input }) {
      const code = slugGenerator(input.name);
      const res = await ctx.prisma.category.create({
        data: { ...input, codeName: code },
      });
      return res;
    },
  })
  .mutation("update-category", {
    input: z
      .object({
        id: z.string(),
      })
      .merge(createCategoryValidator),
    async resolve({ ctx, input }) {
      const { id, ...rest } = input;
      const code = slugGenerator(input.name);
      const res = await ctx.prisma.category.update({
        data: { ...rest, codeName: code },
        where: {
          id,
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
