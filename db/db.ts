import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";

import * as schema from "./schema";

export const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

export const db = drizzle(connection, { schema, mode: "default" });
