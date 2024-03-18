import { type InferSelectModel, relations, sql } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  mysqlEnum,
  text,
  int,
  float,
} from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";

// TODO: users table
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

// TODO: subscriptions table
export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id)
    .notNull(),
  amount: float("amount").notNull(),
  stripePriceId: varchar("stripe_price_id", { length: 256 }).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 }).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 256,
  }).notNull(),
  stripePaymentMethod: varchar("stripe_payment_method", {
    length: 256,
  }).notNull(),
  stripeSubscriptionStatus: mysqlEnum("stripe_subscription_status", [
    "active",
    "canceled",
    "incomplete",
    "incomplete_expired",
    "past_due",
    "trialing",
    "unpaid",
  ]).notNull(),
  stripeSubscriptionEnd: timestamp("stripe_subscription_end").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .onUpdateNow()
    .notNull(),
});

// TODO: files table
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

// TODO: messages table
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  text: text("text"),
  sender: mysqlEnum("sender", ["USER", "BOT"]).notNull(),
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
  fileId: varchar("file_id", { length: 128 })
    .notNull()
    .references(() => files.id),
});

// TODO: settings table
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

// FIXME: relation with users table
export const usersRelations = relations(users, ({ many, one }) => ({
  files: many(files),
  messages: many(messages),
  setting: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  subscriptions: many(subscriptions),
}));

// FIXME: relation with files table
export const fileRelations = relations(files, ({ one, many }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

// FIXME: relation with messages table
export const messageRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  file: one(files, {
    fields: [messages.fileId],
    references: [files.id],
  }),
}));

// TODO: exports all table types
export type User = InferSelectModel<typeof users>;
export type Subscription = InferSelectModel<typeof subscriptions>;
export type File = InferSelectModel<typeof files>;
export type Message = InferSelectModel<typeof messages>;
export type UserSetting = InferSelectModel<typeof userSettings>;
export type FileStatus = typeof files.$inferSelect.status;
export type FileType = typeof files.$inferSelect.type;
export type SubscriptionStatus =
  typeof subscriptions.$inferSelect.stripeSubscriptionStatus;
