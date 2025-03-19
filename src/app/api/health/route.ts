import { db } from "@/lib/db";
import type { Health } from "@/utils/interfaces/health";
import { athletes_health } from "@drizzle/schema";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	const result = await db.select().from(athletes_health);

	if (result.length === 0)
		return NextResponse.json({ message: "Sin registros" }, { status: 404 });

	return NextResponse.json({ health: result });
};

export const POST = async (req: Request) => {
	const body = await req.json();

	const [{ id }] = await db
		.insert(athletes_health)
		.values(body as Health & { athlete_id: string })
		.returning({ id: athletes_health.id });

	return NextResponse.json({ message: id });
};
