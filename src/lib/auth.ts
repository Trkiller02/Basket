import { db } from "@/lib/db";
import { betterAuth } from "better-auth";
import { admin, twoFactor } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated),
	},
	user: {
		additionalFields: {
			restore_code: {
				type: "string",
				required: false,
			},
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
	}),
	emailAndPassword: {
		autoSignIn: true,
		enabled: true, // If you want to use email and password auth
		minPasswordLength: 4, // Minimum password length
		maxPasswordLength: 32, // Maximum password length
		requireEmailVerification: false,
		/* sendResetPassword: async ({ user, url, token }, request) => {
			try {
				const data = await fetchData("/api/emails", {
					method: "POST",
					body: {
						username: user.email,
						url: url,
					},
				});

				console.log(data);
			} catch (error) {
				console.error(error);
			}
		}, */
	},
	plugins: [
		twoFactor(),
		admin({
			adminRole: ["admin", "user"],
			defaultRole: "representante",
		}),
	],
});
