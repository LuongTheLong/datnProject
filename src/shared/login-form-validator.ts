import * as z from "zod";

const loginFormValidator = z.object({
  userName: z.string().min(1, "Username is required."),
  passWord: z.string().min(1, "Password is required."),
});

export { loginFormValidator };

export type LoginFields = z.infer<typeof loginFormValidator>;
