import { db } from "@/lib/db";
import { notifications } from "@drizzle/schema";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const notification = await db.select().from(notifications);

	if (notification.length === 0)
		return NextResponse.json(
			{ message: "No hay notificaciones" },
			{ status: 404 },
		);

	return NextResponse.json({ result: notification });
}
