import { t, authedProcedure } from "../_app";
import { createHmac } from "crypto";
import { z } from "zod";
import { env } from "src/env/server.mjs";
import { stringify } from "query-string";

export const paymentRouter = t.router({
  confirmPayment: authedProcedure
    .input(
      z.object({
        paymentData: z.any(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { vnp_SecureHash, ...rest } = input.paymentData;

      const signedData = stringify(rest, { encode: false });

      const hmac = createHmac("sha512", env.VNP_HASH);
      const signed = hmac.update(signedData.toString()).digest("hex");

      if (vnp_SecureHash === signed && rest.vnp_ResponseCode === "00") {
        const order = await ctx.prisma.order.update({
          where: {
            id: rest.vnp_TxnRef,
          },
          data: {
            paymentStatus: "SUCCESS",
          },
        });

        return {
          paymentStatus: "SUCCESS",
          orderId: order.id,
        };
      }

      await ctx.prisma.order.update({
        where: {
          id: rest.vnp_TxnRef,
        },
        data: {
          paymentStatus: "FAILED",
        },
      });

      return {
        paymentStatus: "ERROR",
        orderId: null,
      };
    }),
});
