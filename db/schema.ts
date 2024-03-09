import { relations, sql } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  mysqlEnum,
  text,
  int,
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

export const files = mysqlTable("files", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  status: mysqlEnum("status", ["PENDING", "PROCESSING", "FAILED", "SUCCESS"])
    .notNull()
    .default("PENDING"),
  path: varchar("path", { length: 256 }).notNull(),
  type: mysqlEnum("type", ["CSV", "JSON"]).notNull().default("CSV"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .onUpdateNow()
    .notNull(),

  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id),
});

export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  text: text("text"),
  sender: mysqlEnum("sender", ["USER", "BOT"]),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .onUpdateNow()
    .notNull(),
});

export const userSettings = mysqlTable("user_settings", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  documentUploaded: int("document_uploaded").notNull().default(0),
  csvUploaded: int("csv_uploaded").notNull().default(0),
  jsonUploaded: int("json_uploaded").notNull().default(0),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .onUpdateNow()
    .notNull(),
  userId: varchar("user_id", { length: 128 }).references(() => users.id),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  files: many(files),
  settings: one(userSettings),
}));
