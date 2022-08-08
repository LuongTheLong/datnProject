import { createRouter } from "./context";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const checkIncomeRouter = createProtectedRouter()
    .query("get-checkIncome", {
        input: z.object({
            id: z.string()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.checkIncome.findMany({ where: { id: input.id } });
            return res;
        },
    }).mutation("create-checkIncome", {
        input: z.object({
            idShift: z.string(),
            startIncome: z.number(),
            inCome: z.number(),
            totalDecrease: z.number(),
            feeService: z.number(),
            vat: z.number(),
            totalBills: z.number(),
            outCome: z.number(),
            moneyRemaining: z.number()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.checkIncome.create({
                data: {
                    idShift: input.idShift,
                    startIncome: input.startIncome,
                    inCome: input.inCome,
                    totalDecrease: input.totalDecrease,
                    feeService: input.feeService,
                    vat: input.vat,
                    totalBills: input.totalBills,
                    outCome: input.outCome,
                    moneyRemaining: input.moneyRemaining
                }
            });
            return res;
        },
    }).mutation("update-checkIncome", {
        input: z.object({
            id: z.string(),
            idShift: z.string(),
            startIncome: z.number(),
            inCome: z.number(),
            totalDecrease: z.number(),
            feeService: z.number(),
            vat: z.number(),
            totalBills: z.number(),
            outCome: z.number(),
            moneyRemaining: z.number()
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.checkIncome.update({
                data: {
                    idShift: input.idShift,
                    startIncome: input.startIncome,
                    inCome: input.inCome,
                    totalDecrease: input.totalDecrease,
                    feeService: input.feeService,
                    vat: input.vat,
                    totalBills: input.totalBills,
                    outCome: input.outCome,
                    moneyRemaining: input.moneyRemaining
                }, where: {
                    id: input.id
                }
            });
            return res;
        },
    }).mutation("delete-checkIncome", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.checkIncome.delete({
                where: {
                    id: input.id
                }
            });
            return res;
        },
    });
