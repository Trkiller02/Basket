import { db } from "@/lib/db";
import type { Health } from "@/utils/interfaces/health";
import { health } from "@drizzle/schema";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	const result = await db.select().from(health);

	if (result.length === 0)
		return NextResponse.json({ message: "Sin registros" }, { status: 404 });

	return NextResponse.json({ health: result });
};

export const POST = async (req: Request) => {
	const body = await req.json();

	const [{ id }] = await db
		.insert(health)
		.values(body as Health & { athlete_id: string })
		.returning({ id: health.id });

	return NextResponse.json({ message: id });
};
