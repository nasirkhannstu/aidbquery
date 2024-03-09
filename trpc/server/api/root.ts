import { userRouters } from "@/trpc/server/routers/users";
import { createTRPCRouter } from "@/trpc/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouters,
});

// export type definition of API
export type AppRouter = typeof appRouter;
