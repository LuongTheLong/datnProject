import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import sgMail from "@sendgrid/mail";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { ROLE } from "@prisma/client";

sgMail.setApiKey(env.SENDGRID_API_KEY);

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role as ROLE;
      }
      return session;
    },
    async signIn({ user }) {
      if (user.firstTime) {
        await sgMail.send({
          to: user.email!,
          from: "lrollking1@gmail.com",
          subject: "Chào mừng bạn đến với dịch vụ thức ăn nhanh Long Food",
          text: "Welcome",
        });

        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            firstTime: false,
          },
        });
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
