import { mysqlTable, bigint, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  fullName: varchar("full_name", { length: 256 }),
  email: varchar("email", { length: 256 }).unique(),
  password: varchar("password", { length: 256 }),
  createdAt: bigint("created_at", { mode: "number" }),
  updatedAt: bigint("updated_at", { mode: "number" }),
});
