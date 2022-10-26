import { t } from "../_app";
import { productRouter } from "./product";
import { categoryRouter } from "./category";
import { cartRouter } from "./cart";

export const appRouter = t.router({
  product: productRouter,
  category: categoryRouter,
  cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
