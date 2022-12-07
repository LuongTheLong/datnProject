import * as z from "zod";
const createUserValidator = z.object({
  name: z.string().min(2, "Tên không được để trống"),
  username: z.string().min(2, "Tên đăng nhập không được để trống").refine(value => {
      if ((/[^a-zA-Z0-9]/g).test(value)) {
        return false;
      }
      return true
    }, "Tên đăng nhập không hợp lệ."),
    

  password: z.string().min(6, "Mật khẩu không được dưới 6 ký tự"),
});

export type CreateUserFormValues = z.infer<typeof createUserValidator>;

export { createUserValidator };
