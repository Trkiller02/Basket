// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { type DefaultJWT, JWT } from "next-auth/jwt";
import NextAuth, { type User, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./lib/db";
import { representatives, users } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface User {
		id?: string;
		name: string | null;
		email: string | null;
		image?: string | null;
		ci_number: string;
		role: "representante" | "secretaria" | "administrador" | "atleta";
	}

	interface Session extends DefaultSession {
		user: {
			ci_number: string;
			role: "representante" | "secretaria" | "administrador" | "atleta";
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	/** Returned by the `jwt` callback and `auth`, when using JWT sessions */
	interface JWT extends DefaultJWT, User {}
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
						id: users.id,
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

				const [{ id: representID }] =
					user.role === "representante"
						? await db
								.select({ id: representatives.id })
								.from(representatives)
								.where(eq(representatives.user_id, user.id))
						: [{ id: undefined }];

				return {
					...userInfo,
					id:
						user.role === "representante" && representID
							? representID
							: user.id,
					name: `${name.split(" ")[0]} ${lastname.split(" ")[0]}`,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			return user ? { ...user, ...token } : token;
		},
		async session({ session, token }) {
			const { sub, iat, exp, jti, picture, ...restToken } = token;

			return {
				...session,
				user: { ...session.user, ...restToken },
			};
		},
	},
	pages: {
		signIn: "/sesion/iniciar",
		signOut: "/sesion/iniciar",
	},
	session: {
		strategy: "jwt",
	},
});
