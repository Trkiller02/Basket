import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const client = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [nextCookies(), adminClient()],
});
