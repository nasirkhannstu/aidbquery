import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
