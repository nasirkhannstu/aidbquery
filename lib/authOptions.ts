import { type AuthOptions, getServerSession, type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import lodash from "lodash";

import { db } from "@/db";
import { users } from "@/db/schema";
import type { ModifyUser } from "@/types/next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "text",
          placeholder: "demo@aipdfquery.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials): Promise<ModifyUser | null> {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials?.email ?? ""));

        if (user.length === 0) throw new Error("Invalid credentials");
        else {
          if (user[0] && credentials?.password) {
            const isValid = await bcrypt.compare(
              credentials?.password,
              user[0]?.password,
            );
            if (!isValid) throw new Error("Invalid credentials");

            return lodash.omit(user[0], ["password"]);
          } else {
            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    jwt({ user, token, session, trigger }) {
      // console.log("session => ", session);
      // console.log("token => ", token);
      // console.log("user => ", user);

      if (trigger === "update") {
        return { ...token, ...(session as Session) };
      }

      return { ...token, ...user };
    },
    redirect(params) {
      return params.baseUrl + "/chats";
    },
    session({ session, token }) {
      session.user = token as unknown as ModifyUser;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getServerAuthSession = () => getServerSession(authOptions);
