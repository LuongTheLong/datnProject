// Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs

import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import * as Nextauth from "../../pages/api/auth/[...nextauth]";

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  // @ts-expect-error
  return await unstable_getServerSession(ctx.req, ctx.res, Nextauth.requestWrapper(ctx.req, ctx.res)[2]);
};
