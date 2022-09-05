// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "src/env/server.mjs";
import { appRouter } from "@server/router";
import { createContext } from "@server/router/context";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
