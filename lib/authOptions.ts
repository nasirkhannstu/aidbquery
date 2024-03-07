import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import lodash from "lodash";

import { User } from "@/types/nextauth";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

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
      async authorize(credentials): Promise<User | null> {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials?.email as string));

        if (user.length === 0) throw new Error("Invalid credentials");
        else {
          const isValid = await bcrypt.compare(
            credentials?.password as string,
            user[0].password
          );
          if (!isValid) throw new Error("Invalid credentials");

          return lodash.omit(user[0], ["password"]);
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
      return params.baseUrl + "/chats";
    },
    async session({ session, token }) {
      session.user = token as User;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
