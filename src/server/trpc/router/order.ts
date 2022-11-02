import { t, adminRouter } from "../_app";
import { z } from "zod";
import { slugGenerator } from "@server/utils/common";

// const categoryInputValidator = z.object({ title: z.string() });
enum PAYMENTSTATUS {
    FAILED = "FAILED",
    SUCCESS = "SUCCESS",
    PENDING = "PENDING"
}

enum PAYMENTTYPE {
    CASH = "CASH",
    VNPAY = "VNPAY"
}

const createInputValidator = z.object({
    id: z.string().nullable(),
    userId: z.string(),
    grandTotal: z.number(),
    option: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            price: z.number(),
            optionCategoryId: z.string(),
        })
    ),
    paymentType: z.string(),
    paymentStatus: z.string(),
    createAt: z.date(),
    updateAt: z.date()
});

export const orderRouter = t.router({
    create: adminRouter.input(createInputValidator).mutation(async ({ input, ctx }) => {
        const order = await ctx.prisma.order.create({
            data: {
                userId: ctx.session.user.id!,
                grandTotal: input.grandTotal,
                option: input.option,
                paymentType: PAYMENTTYPE[input.paymentType],
                paymentStatus: PAYMENTSTATUS[input.paymentStatus],
                createAt: input.createAt,
                updateAt: input.updateAt
            }
        });

        return order;
    }),
    update: adminRouter
        .input(createInputValidator.merge(z.object({ orderId: z.string() })))
        .mutation(async ({ input, ctx }) => {
            const updatedCategory = await ctx.prisma.order.update({
                data: { ...input },
                where: {
                    id: input.orderId,
                },
            });

            return updatedCategory;
        }),
    getAll: t.procedure.query(async ({ ctx }) => {
        const categories = await ctx.prisma.category.findMany({
            where: {
                isDeleted: false,
            },
        });

        return categories;
    }),
    delete: adminRouter.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const deletedCategory = ctx.prisma.category.update({
            where: {
                id: input.id,
            },
            data: {
                isDeleted: true,
            },
        });

        return deletedCategory;
    }),
    getBySlug: t.procedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
        const category = await ctx.prisma.category.findFirst({
            where: {
                slug: input.slug,
                isDeleted: false,
            },
        });

        return category;
    }),
    getProductsByCategories: t.procedure.query(async ({ ctx }) => {
        const products = await ctx.prisma.category.findMany({
            include: {
                products: {
                    take: 6,
                    where: {
                        isDeleted: false,
                    },
                },
            },
        });

        return products;
    }),
});
