import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { createItemValidator } from "@shared/item-validator";
import { slugGenerator } from "@server/utils/common";
import { v2 as cloudinary } from "cloudinary";
import { resolve } from "path";

export const itemRouter = createProtectedRouter()
  .query("get-item", {
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
  .query("get-item-by-categories", {
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.category.findMany({ include: { items: { take: 5 } } });

      return res;
    },
  })
  .mutation("create-item", {
    input: createItemValidator,
    async resolve({ ctx, input }) {
      const imageURL = input.image && (await cloudinary.uploader.upload(input.image)).url;

      const res = await ctx.prisma.item.create({
        data: {
          idCategory: input.idCategory,
          name: input.name,
          codeName: slugGenerator(input.name),
          price: input.price,
          description: input.description,
          image: imageURL,
        },
      });
      return res;
    },
  })
  .mutation("update-item", {
    input: z
      .object({
        id: z.string(),
      })
      .merge(createItemValidator),
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
