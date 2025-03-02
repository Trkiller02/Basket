import { db } from "@/lib/db";
import { betterAuth } from "better-auth";
import { admin, openAPI, twoFactor } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@drizzle/schema";

export const auth = betterAuth({
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	advanced: {
		generateId: false,
	},
	user: {
		additionalFields: {
			lastname: {
				type: "string",
				required: true,
			},
			ci_number: {
				type: "string",
				required: true,
			},
			phone_number: {
				type: "string",
				required: false,
			},
		},
	},
	database: drizzleAdapter(db, {
		// We're using Drizzle as our database
		provider: "pg",
		usePlural: true,
		schema,
	}),
	emailAndPassword: {
		enabled: true, // If you want to use email and password auth
	},
	plugins: [twoFactor(), openAPI(), admin()],
});
