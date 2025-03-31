import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [nextCookies(), adminClient()],
});

export const { signIn, signOut, useSession } = authClient;
