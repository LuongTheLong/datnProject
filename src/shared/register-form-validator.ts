import * as z from "zod";

const registerFormValidator = z.object({
  userName: z.string().min(1),
  passWord: z.string().min(1),
  emailAddress: z.string().email(),
  surName: z.string(),
  givenName: z.string(),
});

export type RegisterFields = z.infer<typeof registerFormValidator>;

export { registerFormValidator };
