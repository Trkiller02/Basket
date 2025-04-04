import { db } from "@/lib/db";
import { MsgError } from "@/utils/messages";
import { users } from "@drizzle/schema";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	const params = req.nextUrl.searchParams;

	const page = params.get("page") ?? 1;
	const limit = params.get("limit") ?? 10;
	const query = params.get("query");
	const deleted = params.get("deleted") === "true";
	const isFormView = params.get("formView");

	try {
		const result = await db
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
					query ? eq(users.ci_number, query) : undefined,
					deleted ? isNotNull(users.deleted_at) : isNull(users.deleted_at),
				),
			)
			.limit(Number(limit))
			.offset((Number(page) - 1) * Number(limit));

		if (result.length === 0)
			return NextResponse.json(
				{ message: MsgError.NOT_FOUND_MANY },
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
