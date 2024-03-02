import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOption";
import { ZodError } from "zod";

const t = initTRPC.create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error?.cause?.flatten()
            : null,
      },
    };
  },
});
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

const isAdmin = middleware(async ({ next }) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user.id || user.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to access this resource",
    });
  }

  return next({ ctx: { userId: user.id, user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
export const adminProcedure = t.procedure.use(isAdmin);
