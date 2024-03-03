import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import lodash from "lodash";

import { LoginUser } from "@/types/nextauth";
import { db } from "@/db/prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "text",
          placeholder: "demo@aicsvquery.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const user = await db.users.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) throw new Error("Invalid credentials");
        else {
          const isValid = await bcrypt.compare(
            credentials?.password as string,
            user.password,
          );
          if (!isValid) throw new Error("Invalid credentials");

          if (user.status === "INACTIVE")
            throw new Error(
              "Your account is inactive, please contact with admin.",
            );

          return lodash.omit(user, ["password"]);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token, session, trigger }) {
      if (trigger === "update") {
        return { ...token, ...session };
      }

      return { ...token, ...user };
    },
    redirect(params) {
      return params.baseUrl + "/files";
    },
    async session({ session, token }) {
      session.user = token as LoginUser;

      return session;
    },
  },
  pages: {
    signIn: "/authentication/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
