import NextAuth from "next-auth";

import type { User } from "@/db/schema";

type ModifyUser = Omit<User, "password" | "bio">;

declare module "next-auth" {
  interface Session {
    user: ModifyUser;
  }
}
