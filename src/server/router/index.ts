// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { todoRouter } from "./todo";
import { materialRouter } from "./material";
import { categoryRouter } from "./category";
import { itemRouter } from "./item";
import { incomeRouter } from "./check-income";
import { shiftRouter } from "./shift";
import { billRouter } from "./bill";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("todo.", todoRouter)
  .merge("material.", materialRouter)
  .merge("category.", categoryRouter)
  .merge("item.", itemRouter)
  .merge("income.", incomeRouter)
  .merge("shift.", shiftRouter)
  .merge("bill.", billRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
