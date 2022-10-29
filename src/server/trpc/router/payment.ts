import { t, authedProcedure } from "../_app";
import { stringify } from "query-string";
import { createHmac } from "crypto";
import { z } from "zod";
import { formatDate } from "@server/utils/common";
import { env } from "src/env/server.mjs";

export const paymentRouter = t.router({
  createVNPayment: authedProcedure.mutation(async ({ ctx }) => {
    let ip;

    if (ctx.req?.headers["x-forwarded-for"]) {
      ip = (ctx.req?.headers["x-forwarded-for"] as string).split(",")[0];
    } else {
      ip = ctx.req?.socket.remoteAddress;
    }

    const requestParams = {
      vnp_Amount: 2000000 * 100,
      vnp_Command: "pay",
      vnp_CreateDate: formatDate(new Date().getTime()),
      vnp_ExpireDate: formatDate(new Date().getTime() + 60 * 60000),
      vnp_CurrCode: "VND",
      vnp_IpAddr: ip,
      vnp_Locale: "vn",
      vnp_OrderInfo: "aaaa",
      vnp_OrderType: "billpayment",
      vnp_ReturnUrl: encodeURIComponent(`${ctx.req?.headers.origin}/order/confirm`),
      vnp_TmnCode: env.VNP_CODE,
      vnp_TxnRef: "zxczxc",
      vnp_Version: "2.1.0",
    };

    const signedData = stringify(requestParams, { encode: false });
    const hmac = createHmac("sha512", env.VNP_HASH);
    const signed = hmac.update(signedData).digest("hex");

    const paymentURL = `${env.VNP_URL}?${signedData}&vnp_SecureHash=${signed}`;

    return paymentURL;
  }),
  confirmPayment: authedProcedure
    .input(
      z.object({
        paymentData: z.any(),
      })
    )
    .query(async ({ input }) => {
      const { vnp_SecureHash, ...rest } = input.paymentData;

      const signedData = stringify(rest, { encode: false });

      const hmac = createHmac("sha512", env.VNP_HASH);
      const signed = hmac.update(signedData).digest("hex");

      if (vnp_SecureHash === signed && rest.vnp_ResponseCode === "00") {
        return {
          paymentStatus: "success",
        };
      }

      return {
        paymentStatus: "error",
      };
    }),
});
