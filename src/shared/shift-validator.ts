import { z } from "zod";

const createShiftValidator = z.object({
    idWorker: z.string(),
});

export { createShiftValidator };
