import * as z from "zod";
const createUserValidator = z.object({
  name: z.string().min(2, "Tên không được để trống"),
  username: z.string().min(6, "Tên đăng nhập trên 6 ký tự"),
  password: z.string().min(6, "Mật khẩu không được dưới 6 ký tự"),
});

export type CreateUserFormValues = z.infer<typeof createUserValidator>;

export { createUserValidator };
