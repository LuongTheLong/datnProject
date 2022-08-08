import { createRouter } from "./context";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const billRouter = createProtectedRouter()
    .query("get-bill", {
        input: z.object({
            numberDesk: z.string(),
            idShift: z.string(),
            vat: z.number(),
            coupon: z.number(),
            totalCount: z.number()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.bill.findMany({ where: { idShift: input.idShift } });
            return res;
        },
    }).mutation("create-bill", {
        input: z.object({
            numberDesk: z.string(),
            idShift: z.string(),
            vat: z.number(),
            coupon: z.number(),
            totalCount: z.number()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.bill.create({
                data: {
                    numberDesk: input.numberDesk,
                    idShift: input.idShift,
                    vat: input.vat,
                    coupon: input.coupon,
                    totalCount: input.totalCount
                }
            });
            return res;
        },
    }).mutation("update-bill", {
        input: z.object({
            id: z.string(),
            numberDesk: z.string(),
            idShift: z.string(),
            vat: z.number(),
            coupon: z.number(),
            totalCount: z.number()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.bill.update({
                data: {
                    numberDesk: input.numberDesk,
                    idShift: input.idShift,
                    vat: input.vat,
                    coupon: input.coupon,
                    totalCount: input.totalCount
                }, where: {
                    id: input.id
                }
            });
            return res;
        },
    }).mutation("delete-bill", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.bill.delete({
                where: {
                    id: input.id
                }
            });
            return res;
        },
    });
