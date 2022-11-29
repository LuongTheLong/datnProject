import { t } from "../_app";
import { z } from "zod";

export const optionsRouter = t.router({
  getByCategory: t.procedure.input(z.object({ categoryId: z.string() })).query(async ({ ctx, input }) => {
    const options = await ctx.prisma.optionCategory.findMany({
      where: {
        category: {
          id: input.categoryId,
        },
      },
      include: {
        choices: {
          select: {
            optionCategoryId: false,
            id: true,
            price: true,
            title: true,
          },
        },
      },
    });

    return options;
  }),
});
