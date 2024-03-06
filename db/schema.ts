import { sql } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  datetime,
  timestamp,
  serial,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey().autoincrement(),
  fullName: varchar("full_name", { length: 256 }),
  email: varchar("email", { length: 256 }).unique(),
  password: varchar("password", { length: 256 }),
  createdAt: datetime("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .onUpdateNow(),
});
