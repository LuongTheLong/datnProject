import { authedProcedure, t } from "../_app";
import { z } from "zod";
import { createCartItemValidator, updateCartValidator } from "@shared/validators/cart-validator";
import { Choice } from "@prisma/client";
import { flatten, uniqBy } from "lodash-es";

export const cartRouter = t.router({
  add: authedProcedure.input(createCartItemValidator).mutation(async ({ ctx, input }) => {
    if (input.id) {
      const updatedItem = await ctx.prisma.cart.update({
        where: {
          id: input.id,
        },
        data: {
          quantity: {
            increment: input.quantity,
          },
        },
      });

      return updatedItem;
    }

    const newItem = await ctx.prisma.cart.create({
      data: {
        userId: ctx.session.user.id,
        option: input.option,
        productId: input.productId,
        quantity: input.quantity,
      },
    });

    return newItem;
  }),

  update: authedProcedure.input(updateCartValidator).mutation(async ({ ctx, input }) => {
    const updatedItem = await ctx.prisma.cart.update({
      where: {
        id: input.id,
      },
      data: {
        option: input.option,
        quantity: input.quantity,
      },
    });

    return updatedItem;
  }),

  getAll: authedProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.cart.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        product: true,
      },
    });

    if (items.length === 0) {
      const cart = items.map(item => ({ ...item, total: 0 }));

      return {
        cart,
        grandTotal: 0,
      };
    }

    const itemsOptions = flatten<Choice>(items.map(item => item.option as Choice[]));
    const optionIds = uniqBy(itemsOptions, "id").map(item => item.id);

    const options = await ctx.prisma.choice.findMany({
      where: {
        id: {
          in: optionIds,
        },
      },
    });

    const itemsWithPrice = items.map(item => {
      const choices = item.option as Choice[];
      let optionTotal = 0;
      choices.forEach(choice => {
        optionTotal += options.find(opt => opt.id === choice.id)?.price || 0;
      });
      return { ...item, total: item.quantity * (item.product.price + optionTotal) };
    });

    const grandTotal = itemsWithPrice.reduce((prev, curr) => {
      return prev + curr.total;
    }, 0);

    return {
      cart: itemsWithPrice,
      grandTotal,
    };
  }),

  delete: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const deletedItem = await ctx.prisma.cart.delete({
      where: {
        id: input.id,
      },
    });

    return deletedItem;
  }),
});
