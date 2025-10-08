import { auth } from "@/auth";
import { db } from "@/lib/db";
import { insertHistory } from "@/lib/db-data";
import type { User } from "@/utils/interfaces/user";
import { MsgError } from "@/utils/messages";
import { regexList } from "@/utils/regexPatterns";
import { history, users } from "@drizzle/schema";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const querys = req.nextUrl.searchParams;
	const deleted = querys.get("deleted") === "true";
	const isFormView = querys.get("formView");

	try {
		const [result] = await db
			.select(
				isFormView
					? { id: users.id, ci_number: users.ci_number }
					: {
							id: users.id,
							name: users.name,
							lastname: users.lastname,
							email: users.email,
							phone_number: users.phone_number,
							ci_number: users.ci_number,
							role: users.role,
						},
			)
			.from(users)
			.where(
				and(
					eq(
						id?.includes("@")
							? users.email
							: id.match(regexList.forDNI)
								? users.ci_number
								: users.id,
						id ?? "",
					),
					deleted ? isNotNull(users.deleted_at) : isNull(users.deleted_at),
				),
			);

		if (!result)
			return NextResponse.json(
				{ message: MsgError.NOT_FOUND },
				{ status: 404 },
			);

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{
				message:
					(error as Error).message === "connect ECONNREFUSED 127.0.0.1:5432"
						? MsgError.DB_CONNECTION
						: (error as Error).message,
			},
			{ status: 400 },
		);
	}
}

export const PATCH = auth(
	async (req, { params }: { params: Promise<{ id: string }> }) => {
		const { id } = await params;

		if (!req.auth)
			return NextResponse.json(
				{ message: MsgError.UNAUTHORIZED },
				{ status: 401 },
			);

		if (req.auth.user.id !== id || "administrador" !== req.auth.user.role)
			return NextResponse.json(
				{ message: MsgError.UNAUTHORIZED },
				{ status: 401 },
			);

		try {
			const user_data = (await req.json()) as Partial<Omit<User, "id">>;

			const [user] = await db
				.select()
				.from(users)
				.where(
					and(
						eq(
							id?.includes("@")
								? users.email
								: id.match(regexList.forDNI)
									? users.ci_number
									: users.id,
							id ?? "",
						),
						isNull(users.deleted_at),
					),
				);

			if (!user) {
				return NextResponse.json(
					{ message: MsgError.NOT_FOUND },
					{ status: 404 },
				);
			}

			await db.transaction(async (tx) => {
				await tx.update(users).set(user_data).where(eq(users.id, user.id));

				await tx.insert(history).values({
					user_id: req.auth?.user.id ?? "",
					action: "MODIFICO",
					description: `Usuario ${user.ci_number} actualizado`,
				});
			});

			return NextResponse.json({
				message: "Usuario actualizado correctamente",
			});
		} catch (error) {
			return NextResponse.json(
				{
					message:
						(error as Error).message === "connect ECONNREFUSED 127.0.0.1:5432"
							? MsgError.DB_CONNECTION
							: (error as Error).message,
				},
				{ status: 400 },
			);
		}
	},
);

export const DELETE = auth(
	async (req, { params }: { params: Promise<{ id: string }> }) => {
		const { id } = await params;

		if (!req.auth)
			return NextResponse.json(
				{ message: MsgError.UNAUTHORIZED },
				{ status: 401 },
			);

		if (req.auth.user.id !== id || "administrador" !== req.auth.user.role)
			return NextResponse.json(
				{ message: MsgError.UNAUTHORIZED },
				{ status: 401 },
			);

		try {
			const [user] = await db
				.select()
				.from(users)
				.where(
					and(
						eq(
							id?.includes("@")
								? users.email
								: id.match(regexList.forDNI)
									? users.ci_number
									: users.id,
							id ?? "",
						),
						isNull(users.deleted_at),
					),
				);

			if (!user) {
				return NextResponse.json(
					{ message: MsgError.NOT_FOUND },
					{ status: 404 },
				);
			}

			if (user.role === "administrador")
				return NextResponse.json(
					{ message: "No se puede eliminar un administrador" },
					{ status: 400 },
				);

			await db.transaction(async (tx) => {
				await db
					.update(users)
					.set({ deleted_at: new Date(Date.now()).toISOString().split("T")[0] })
					.where(eq(users.id, user.id));

				await tx.insert(history).values({
					user_id: req.auth?.user.id ?? "",
					action: "ELIMINO",
					description: `Usuario ${user.ci_number} eliminado`,
				});
			});

			return NextResponse.json({
				message: "Usuario eliminado correctamente",
			});
		} catch (error) {
			return NextResponse.json(
				{
					message:
						(error as Error).message === "connect ECONNREFUSED 127.0.0.1:5432"
							? MsgError.DB_CONNECTION
							: (error as Error).message,
				},
				{ status: 400 },
			);
		}
	},
);
