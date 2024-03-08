import { migrate } from "drizzle-orm/mysql2/migrator";

import { db, connection } from ".";

await migrate(db, { migrationsFolder: "../drizzle" });

await connection.end();
