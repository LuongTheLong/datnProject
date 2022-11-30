import { t } from "../_app";
import { productRouter } from "./product";
import { categoryRouter } from "./category";
import { cartRouter } from "./cart";
import { optionsRouter } from "./options";
import { paymentRouter } from "./payment";
import { orderRouter } from "./order";
import { userRouter } from "./user";

export const appRouter = t.router({
  product: productRouter,
  category: categoryRouter,
  cart: cartRouter,
  options: optionsRouter,
  payment: paymentRouter,
  order: orderRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
