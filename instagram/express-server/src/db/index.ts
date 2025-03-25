import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle(Bun.env.DATABASE_URL ?? "", {
	schema,
	casing: "snake_case",
});

export type DB = typeof db;

export default db;
