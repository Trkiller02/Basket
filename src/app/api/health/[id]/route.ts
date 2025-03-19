import { db } from "@/lib/db";
import { athletes_health } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const querys = req.nextUrl.searchParams;
	const formAthlete = querys.get("formAthlete");

	const { id } = await params;

	const [result] = await db
		.select()
		.from(athletes_health)
		.where(
			formAthlete
				? eq(athletes_health.athlete_id, id)
				: eq(athletes_health.id, +id),
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

	const result = await db
		.update(athletes_health)
		.set(body)
		.where(eq(athletes_health.id, +id));
};
