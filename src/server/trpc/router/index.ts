import { t } from "../_app";
import { productRouter } from "./product";
import { categoryRouter } from "./category";
import { cartRouter } from "./cart";
import { optionsRouter } from "./options";

export const appRouter = t.router({
  product: productRouter,
  category: categoryRouter,
  cart: cartRouter,
  options: optionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
