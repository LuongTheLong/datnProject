import { t, authedProcedure } from "../_app";
import { z } from "zod";

export const userRouter = t.router({
  update: authedProcedure
    .input(
      z.object({
        name: z.string(),
        phoneNumber: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: input,
        select: {
          email: true,
          id: true,
          name: true,
          phoneNumber: true,
        },
      });

      return user;
    }),
});
