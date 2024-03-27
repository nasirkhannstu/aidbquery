import { adminProcedure, createTRPCRouter } from "@/trpc/server/api/trpc";

export const adminRouter = createTRPCRouter({
  users: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.query.users.findMany({
      orderBy: (users, { asc }) => asc(users.createdAt),
    });

    return users;
  }),
});
