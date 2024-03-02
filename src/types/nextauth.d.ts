import { User } from "@prisma/client";
type LoginUser = Omit<User, "password">;

declare module "next-auth" {
  interface Session {
    user?: LoginUser;
  }
}
