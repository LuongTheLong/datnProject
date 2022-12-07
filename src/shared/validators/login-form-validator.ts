import * as z from "zod";

const loginFormValidator = z.object({
  emailOrUsername: z
    .string()
    .min(2, "Tên đăng nhập không được để trống")
    .refine(value => {
      if (/[^a-zA-Z0-9]/g.test(value)) {
        return false;
      }
      return true;
    }, "Tên đăng nhập không hợp lệ."),
  password: z.string().min(1, "Password is required."),
});

export { loginFormValidator };

export type LoginFields = z.infer<typeof loginFormValidator>;
