import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2/promise";

dotenv.config({ path: "../.env" });

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  connection: Pool | undefined;
};

export const connection =
  globalForDb.connection ?? createPool({ uri: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== "production") globalForDb.connection = connection;

export const db = drizzle(connection, { schema, mode: "default" });
