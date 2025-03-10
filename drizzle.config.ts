import { defineConfig } from "drizzle-kit";

process.loadEnvFile();

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
	introspect: {
		casing: "preserve",
	},
	schema: "./drizzle/schema.ts",
});
