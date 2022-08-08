// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { todoRouter } from "./todo";
import { materialRouter } from "./material";
import { categoryRouter } from "./category";
import { itemRouter } from "./item";
import { checkIncomeRouter } from "./checkIncome";
import { shiftRouter } from "./shift";
import { billRouter } from "./bill";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("question.", protectedExampleRouter)
  .merge("todo.", todoRouter)
  .merge("material.", materialRouter)
  .merge("category.", categoryRouter)
  .merge("item.", itemRouter)
  .merge("checkIncome.", checkIncomeRouter)
  .merge("shift.", shiftRouter)
  .merge("bill.", billRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
