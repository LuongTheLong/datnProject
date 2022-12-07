import * as z from "zod";

const loginFormValidator = z.object({
  emailOrUsername: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export { loginFormValidator };

export type LoginFields = z.infer<typeof loginFormValidator>;
