import { db } from "@/lib/db";
import { MsgError } from "@/utils/messages";
import { regexList } from "@/utils/regexPatterns";
import { users } from "@drizzle/schema";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

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
