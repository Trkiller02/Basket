import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./lib/db";
import { users } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
		role: "representante" | "secretaria" | "administrador" | "atleta";
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				query: {
					label: "Email or DNI",
					placeholder: "johndoe@gmail.com",
					required: true,
				},
				password: {
					type: "password",
					label: "Contraseña",
					placeholder: "*****",
					required: true,
				},
			},
			authorize: async (credentials) => {
				// return user object with their profile data
				const [user] = await db
					.select({
						name: users.name,
						lastname: users.lastname,
						password: users.password,
						email: users.email,
						ci_number: users.ci_number,
						role: users.role,
					})
					.from(users)
					.where(eq(users.ci_number, credentials.query as string));

				if (!user) return null;

				const { password, name, lastname, ...userInfo } = user;

				if (!password) return null;

				const isValidPassword = await bcrypt.compare(
					credentials.password as string,
					password,
				);

				if (!isValidPassword) return null;

				return {
					...userInfo,
					name: `${name} ${lastname}`,
				};
			},
		}),
	],
});
