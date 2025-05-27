import Credentials from "next-auth/providers/credentials";
import NextAuth, { User } from "next-auth";
import { fetchData } from "./utils/fetchHandler";

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface User {
		id?: string;
		name: string;
		ci_number: string;
		email: string;
		image?: string;
		role: "representante" | "secretaria" | "administrador";
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				query: {
					required: true,
					label: "Email or DNI",
					placeholder: "email@example.com",
				},
				password: {
					required: true,
					label: "Password",
					type: "password",
					placeholder: "Your password",
				},
			},
			async authorize(credentials) {
				const user = await fetchData<User>("/api/users", {
					method: "POST",
					body: credentials,
				});

				if (!user) return null;

				return user;
			},
		}),
	],
	/* pages: {
		signIn: "/sesion/iniciar",
	}, */
});
