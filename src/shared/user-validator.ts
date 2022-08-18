import { z } from "zod";

const createUserValidator = z.object({
    name: z.string(),
    point: z.number().default(0),
    pointCurrent: z.number().default(0),
    role: z.enum(["ADMIN",
        "MANAGER",
        "WORKER",
        "USER"])
});

export { createUserValidator };
