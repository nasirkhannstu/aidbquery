import NextAuth from "next-auth";

import type { User } from "@/db/schema";

type ModifyUser = Omit<User, "password">;

declare module "next-auth" {
  interface Session {
    user: ModifyUser;
  }
}
