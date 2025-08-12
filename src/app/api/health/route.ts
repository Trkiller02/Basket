import { auth } from "@/auth";
import { db } from "@/lib/db";
import { insertHistory } from "@/lib/db-data";
import type { Health } from "@/utils/interfaces/health";
import { health } from "@drizzle/schema";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	const result = await db.select().from(health);

	if (result.length === 0)
		return NextResponse.json({ message: "Sin registros" }, { status: 404 });

	return NextResponse.json({ health: result });
};

export const POST = auth(async (req) => {
	const body = await req.json();

	const [{ id }] = await db
		.insert(health)
		.values(body as Health & { athlete_id: string })
		.returning({ id: health.id });

	await insertHistory({
		user_id: req.auth?.user.id ?? "",
		description: `Registro de salud para ${body.athlete_id} creado`,
		action: "CREO",
		reference_id: id.toString(),
	});

	return NextResponse.json({ message: id });
});
