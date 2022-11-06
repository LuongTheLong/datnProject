import NextAuth, { DefaultSession } from "next-auth";
import { ROLE } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: ROLE;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    role: ROLE;
    firstTime: boolean;
  }
}
