import { userRouters } from "@/trpc/server/routers/users";
import { createTRPCRouter } from "@/trpc/server/api/trpc";
import { fileRouter } from "../routers/files";
import { messageRouter } from "../routers/messages";
import { paymentRouter } from "../routers/payments";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouters,
  files: fileRouter,
  messages: messageRouter,
  payments: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
