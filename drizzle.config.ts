import dotenv from "dotenv";
import { type Config } from "drizzle-kit";

dotenv.config({ path: "./.env" });

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL,
  },
} satisfies Config;
