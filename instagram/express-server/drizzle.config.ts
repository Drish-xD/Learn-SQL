import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "",
	},
	dialect: "postgresql",
	casing: "snake_case",
	schema: "./src/db/schema.ts",
	out: "./src/db",
	schemaFilter: "public",
	introspect: {
		casing: "camel",
	},
	migrations: {
		table: "my-migrations-table",
		schema: "public",
	},
	breakpoints: true,
	strict: true,
	verbose: true,
});