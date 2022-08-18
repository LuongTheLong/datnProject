import * as z from "zod";
import { createProtectedRouter } from "./protected-router";
import { createUserValidator } from "@shared/user-validator";

export const userRouter = createProtectedRouter()
    .query("get-all-user", {
        input: z.object({
            name: z.string(),
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.user.findMany({ where: { name: input.name } });

            return res;
        },
    })
    .mutation("update-user", {
        input: z.object({
            id: z.string(),
        }).merge(createUserValidator),
        async resolve({ ctx, input }) {
            const { id, ...rest } = input;
            const res = await ctx.prisma.user.update({
                data: rest,
                where: {
                    id,
                },
            });
            return res;
        },
    })
    .mutation("delete-user", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.user.delete({
                where: {
                    id: input.id,
                },
            });
            return res;
        },
    });
