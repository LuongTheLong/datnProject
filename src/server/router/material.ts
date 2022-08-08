import { createRouter } from "./context";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const materialRouter = createProtectedRouter()
    .query("get-material", {
        input: z.object({
            name: z.string().optional(),
            codeName: z.string().optional()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.material.findMany({ where: { OR: [{ name: input.name }, { codeName: input.codeName }] } });
            return res;
        },
    }).mutation("create-material", {
        input: z.object({
            name: z.string(),
            codeName: z.string(),
            count: z.number().optional(),
            unit: z.string().optional(),
            description: z.string().optional()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.material.create({
                data: {
                    name: input.name,
                    codeName: input.codeName,
                    count: input.count,
                    unit: input.unit,
                    description: input.description
                }
            });
            return res;
        },
    }).mutation("update-material", {
        input: z.object({
            id: z.string(),
            name: z.string(),
            codeName: z.string(),
            count: z.number().optional(),
            unit: z.string().optional(),
            description: z.string().optional()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.material.update({
                data: {
                    name: input.name,
                    codeName: input.codeName,
                    count: input.count,
                    unit: input.unit,
                    description: input.description
                }, where: {
                    id: input.id
                }
            });
            return res;
        },
    }).mutation("delete-material", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.material.delete({
                where: {
                    id: input.id
                }
            });
            return res;
        },
    });
