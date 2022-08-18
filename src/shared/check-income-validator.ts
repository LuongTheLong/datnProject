import { z } from "zod";

const createCheckIncomeValidator = z.object({
    idShift: z.string(),
    startIncome: z.number(),
    income: z.number(),
    totalDecrease: z.number(),
    feeService: z.number(),
    vat: z.number(),
    totalBills: z.number(),
    outcome: z.number(),
    moneyRemaining: z.number()
})
export { createCheckIncomeValidator };
