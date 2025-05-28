import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@drizzle/schema";
import * as relations from "@drizzle/relations";

export const db = drizzle(process.env.DATABASE_URL as string, {
	schema: { ...schema, ...relations },
});
