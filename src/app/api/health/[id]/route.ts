import { db } from "@/lib/db";
import { regexList } from "@/utils/regexPatterns";
import { athletes, health, users } from "@drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const querys = req.nextUrl.searchParams;
	const formAthlete = querys.get("formAthlete");

	const { id } = await params;

	const [athlete] = id.match(regexList.forDNI)
		? await db
				.select({ id: athletes.id })
				.from(athletes)
				.innerJoin(users, eq(athletes.user_id, users.id))
				.where(
					and(
						eq(
							users.ci_number,

							id ?? "",
						),
						isNull(users.deleted_at),
					),
				)
		: [undefined];

	const [result] = await db
		.select()
		.from(health)
		.where(
			formAthlete
				? athlete
					? eq(health.athlete_id, athlete.id)
					: eq(health.athlete_id, id)
				: eq(health.id, +id),
		);

	if (!result)
		return NextResponse.json(
			{ message: "Datos de salud no encontrados" },
			{ status: 404 },
		);

	return NextResponse.json(result);
};

export const PATCH = async (
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { body } = await req.json();
	const { id } = await params;

	const result = await db.update(health).set(body).where(eq(health.id, +id));
};
