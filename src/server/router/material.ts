import { z } from "zod";
import { createMaterialValidator } from "@shared/create-material-validation-schema";
import { createProtectedRouter } from "./protected-router";
import { slugGenerator } from "../utils/common";

export const materialRouter = createProtectedRouter()
  .query("get-all", {
    input: z.object({
      name: z.string().optional(),
      codeName: z.string().optional(),
    }),
    async resolve({ ctx }) {
      const res = await ctx.prisma.material.findMany();
      return res;
    },
  })
  .mutation("create", {
    input: createMaterialValidator,
    async resolve({ ctx, input }) {
      const code = slugGenerator(input.name);

      const res = await ctx.prisma.material.create({
        data: { ...input, codeName: code },
      });
      return res;
    },
  })
  .mutation("update", {
    input: z
      .object({
        id: z.string(),
      })
      .merge(createMaterialValidator),
    async resolve({ ctx, input }) {
      const { id, ...rest } = input;

      const code = slugGenerator(input.name);

      const res = await ctx.prisma.material.update({
        data: { ...rest, codeName: code },
        where: {
          id,
        },
      });
      return res;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.material.delete({
        where: {
          id: input.id,
        },
      });
      return res;
    },
  });
