import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/server/api/trpc";

export const paymentRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      //
      return true;
    }),
});
