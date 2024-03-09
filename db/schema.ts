import { sql } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  fullName: varchar("full_name", { length: 32 }).notNull(),
  email: varchar("email", { length: 32 }).unique().notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .onUpdateNow()
    .notNull(),
});
