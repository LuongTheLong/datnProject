import { t } from "../_app";
import { productRouter } from "./product";
import { categoryRouter } from "./category";

export const appRouter = t.router({
  product: productRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
