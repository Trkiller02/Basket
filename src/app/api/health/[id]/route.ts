import { db } from "@/lib/db";
import { health } from "@drizzle/schema";
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
		.from(health)
		.where(formAthlete ? eq(health.athlete_id, id) : eq(health.id, +id));

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
