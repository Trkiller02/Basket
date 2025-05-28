import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
		role: "representative" | "secretary" | "administrator";
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				query: {
					label: "Email or DNI",
					placeholder: "johndoe@gmail.com",
				},
				password: {
					type: "password",
					label: "Contraseña",
					placeholder: "*****",
				},
			},
			authorize: async (credentials) => {
				// return user object with their profile data
				return {
					name: "John Doe",
					email: "johndoe@gmail.com",
					ci_number: "123456789",
					role: "administrator",
				};
			},
		}),
	],
});
