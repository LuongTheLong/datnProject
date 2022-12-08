// thanks to https://github.com/abehidek for the solution

import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import Cookies from "cookies";
import * as z from "zod";
import { decode, encode } from "next-auth/jwt";
import { compare } from "bcrypt";
import { User } from "@prisma/client";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = requestWrapper(req, res);
  return await NextAuth(...data);
};

export default handler;

export function requestWrapper(
  req: NextApiRequest,
  res: NextApiResponse
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
  const generateSessionToken = () => randomUUID();

  const fromDate = (time: number, date = Date.now()) => new Date(date + time * 1000);

  const adapter = PrismaAdapter(prisma);

  const opts: NextAuthOptions = {
    // Include user.id on session
    adapter: adapter,
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
          session.user.role = user.role;
          session.user.phoneNumber = user.phoneNumber;
          session.user.name = user.name;
        }
        return session;
      },
      async signIn({ user }) {
        // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          if (user) {
            const sessionToken = generateSessionToken();
            console.log(sessionToken);
            const sessionMaxAge = 60 * 60 * 24 * 30;
            const sessionExpiry = fromDate(sessionMaxAge);

            await adapter.createSession({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            });

            const cookies = new Cookies(req, res);

            cookies.set("next-auth.session-token", sessionToken, {
              expires: sessionExpiry,
            });
          }
        }

        return true;
      },
    },
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");
          if (cookie) return cookie;
          else return "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret });
      },
    },
    // Configure one or more authentication providers
    secret: env.NEXTAUTH_SECRET,
    debug: true,
    providers: [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialProvider({
        name: "CredentialProvider",
        credentials: {
          username: { label: "username", type: "text" },
          password: { label: "password", type: "password" },
        },
        async authorize(credentials, req) {
          // verifying if credential email exists on db
          let user: User | null = null;

          if (z.string().email().safeParse(credentials?.username).success) {
            user = await prisma.user.findFirst({
              where: {
                email: credentials?.username,
              },
            });
          } else {
            user = await prisma.user.findFirst({
              where: {
                username: credentials?.username,
              },
            });
          }

          if (user) {
            const match = await compare(credentials?.password!, user.password!);

            if (match) {
              return user;
            }

            return null;
          }

          return null;
        },
      }),
    ],
    pages: {
      signIn: "/login",
    },
  };

  return [req, res, opts];
}
