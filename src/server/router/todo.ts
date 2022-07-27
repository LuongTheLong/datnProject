import { createRouter } from "./context";
import { z } from "zod";
import { resolve } from "path";

export const todoRouter = createRouter()
    .query("get-list-todo", {
        input: z.object({
            name: z.string().optional()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.toDo.findMany({ where: { AND: [{ name: input.name }] } });
            return res;
        },
    }).mutation("create-todo", {
        input: z.object({
            name: z.string()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.toDo.create({ data: { name: input.name } });
            return res;
        },
    });
