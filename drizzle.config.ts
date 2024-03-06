import "dotenv/config";
import { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as number,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
} satisfies Config;
