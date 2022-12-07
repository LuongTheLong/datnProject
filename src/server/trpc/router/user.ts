import { t, authedProcedure } from "../_app";
import { createUserValidator } from "@shared/validators/create-user-validator";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";

const SALT_ROUND = 8;

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

  createUser: t.procedure.input(createUserValidator).mutation(async ({ ctx, input }) => {
    const existedUser = await ctx.prisma.user.findFirst({
      where: {
        username: input.username,
      },
    });

    if (existedUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Tài khoản đã tồn tại",
      });
    }

    const hashPassword = await hash(input.password, SALT_ROUND);

    const user = await ctx.prisma.user.create({
      data: {
        name: input.name,
        username: input.username,
        password: hashPassword,
      },
    });

    return user;
  }),
});
