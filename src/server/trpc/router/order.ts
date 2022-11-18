import { t, authedProcedure } from "../_app";
import { z } from "zod";
import { PAYMENTTYPE } from "@prisma/client";
import { stringify } from "query-string";
import { createHmac } from "crypto";
import { formatDate } from "@server/utils/common";
import { env } from "src/env/server.mjs";

const createInputValidator = z.object({
  grandTotal: z.number(),
  paymentType: z.nativeEnum(PAYMENTTYPE),
  phoneNumber: z.string(),
  deliverTime: z.string(),
  products: z.array(
    z.object({
      total: z.number(),
      productId: z.string(),
      price: z.number(),
      quantity: z.number(),
      option: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          price: z.number(),
        })
      ),
    })
  ),
});

export const orderRouter = t.router({
  create: authedProcedure.input(createInputValidator).mutation(async ({ input, ctx }) => {
    const { grandTotal, paymentType, phoneNumber, deliverTime } = input;

    const order = await ctx.prisma.order.create({
      data: {
        grandTotal,
        userId: ctx.session.user.id,
        paymentStatus: "PENDING",
        paymentType,
        deliverTime,
        phoneNumber,
      },
    });

    const products = input.products.map(product => ({ ...product, orderId: order.id }));

    await ctx.prisma.orderDetail.createMany({
      data: products,
    });

    await ctx.prisma.cart.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    let ip;

    if (ctx.req?.headers["x-forwarded-for"]) {
      ip = (ctx.req?.headers["x-forwarded-for"] as string).split(",")[0];
    } else {
      ip = ctx.req?.socket.remoteAddress;
    }

    const requestParams = {
      vnp_Amount: grandTotal * 100,
      vnp_Command: "pay",
      vnp_CreateDate: formatDate(new Date().getTime()),
      vnp_ExpireDate: formatDate(new Date().getTime() + 60 * 60000),
      vnp_CurrCode: "VND",
      vnp_IpAddr: ip,
      vnp_Locale: "vn",
      vnp_OrderInfo: "abc",
      vnp_OrderType: "billpayment",
      vnp_ReturnUrl: encodeURIComponent(`${ctx.req?.headers.origin}/order/process`),
      vnp_TmnCode: env.VNP_CODE,
      vnp_TxnRef: order.id,
      vnp_Version: "2.1.0",
    };

    const signedData = stringify(requestParams, { encode: false });
    const hmac = createHmac("sha512", env.VNP_HASH);
    const signed = hmac.update(signedData).digest("hex");

    const paymentURL = `${env.VNP_URL}?${signedData}&vnp_SecureHash=${signed}`;

    return paymentURL;
  }),
  update: authedProcedure
    .input(createInputValidator.merge(z.object({ orderId: z.string() })))
    .mutation(async ({ input, ctx }) => {
      const updatedOrder = await ctx.prisma.order.update({
        data: { ...input },
        where: {
          id: input.orderId,
        },
      });

      return updatedOrder;
    }),
  getAll: t.procedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany({});

    return orders;
  }),
  delete: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const deletedOrder = await ctx.prisma.order.delete({
      where: {
        id: input.id,
      },
    });

    return deletedOrder;
  }),

  findById: authedProcedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
        },
      });

      return order;
    }),
});
