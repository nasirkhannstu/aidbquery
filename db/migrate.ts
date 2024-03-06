import { migrate } from "drizzle-orm/mysql2/migrator";

import { db, connection } from "./db";

migrate(db, { migrationsFolder: "../drizzle" });

connection.end();
