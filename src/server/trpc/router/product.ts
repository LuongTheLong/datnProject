import { adminRouter, t } from "../_app";
import { z } from "zod";
import { createProductValidator } from "@shared/validators/product-validator";
import { v2 as cloudinary } from "cloudinary";
import { slugGenerator } from "@server/utils/common";

export const productRouter = t.router({
  create: adminRouter.input(createProductValidator).mutation(async ({ input, ctx }) => {
    const image = (await cloudinary.uploader.upload(input.image as string)).url;
    const product = await ctx.prisma.product.create({ data: { ...input, code: slugGenerator(input.title), image } });

    return product;
  }),
  update: adminRouter
    .input(z.object({ productId: z.string(), data: createProductValidator }))
    .mutation(async ({ input, ctx }) => {
      const { data, productId } = input;

      let image = data.image as string;

      if (image && !data.image?.includes("cloudinary")) {
        image = (await cloudinary.uploader.upload(image)).url;
      }

      const updatedProduct = await ctx.prisma.product.update({
        data: {
          ...data,
          image,
        },
        where: {
          id: productId,
        },
      });

      return updatedProduct;
    }),
  delete: adminRouter.input(z.object({ productId: z.string() })).mutation(async ({ input, ctx }) => {
    const deletedProduct = await ctx.prisma.product.update({
      where: {
        id: input.productId,
      },
      data: {
        isDeleted: true,
      },
    });

    return deletedProduct;
  }),
  getById: t.procedure.input(z.object({ productId: z.string() })).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findFirst({
      where: {
        id: input.productId,
      },
    });

    return product;
  }),
  getByCategory: t.procedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findMany({
      where: {
        category: {
          slug: input.slug,
        },
      },
    });

    return product;
  }),
  getInfiniteProducts: t.procedure
    .input(z.object({ slug: z.string(), limit: z.number().nullish(), cursor: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const products = await ctx.prisma.product.findMany({
        where: {
          category: {
            slug: input.slug,
          },
        },

        take: limit || 4,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (products.length > 3) {
        const nextProduct = products.pop();
        nextCursor = nextProduct!.id;
      }

      return { products, nextCursor };
    }),

  getAll: adminRouter.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        createdAt: false,
        isDeleted: false,
        category: true,
        title: true,
        image: true,
        price: true,
        isSaling: true,
        stock: true,
        id: true,
        description: true,
        code: true,
        categoryId: true,
      },
    });

    return products;
  }),
});
