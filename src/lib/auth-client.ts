import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [
		nextCookies(),
		adminClient(),
		inferAdditionalFields({
			user: {
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
		}),
	],
});

export const { signIn, signOut, useSession, signUp } = authClient;
