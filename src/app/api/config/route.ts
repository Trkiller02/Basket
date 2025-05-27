import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NOTIFICATION_MSG, NOTIFICATION_TYPE } from "@/utils/typeNotifications";
import { configurations, notifications } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const querys = req.nextUrl.searchParams;

	const property = querys.get("property");

	if (!property)
		return NextResponse.json({ message: "No se especificó propiedad" });

	const propertyValue = await db
		.select()
		.from(configurations)
		.where(property ? eq(configurations.id, property) : undefined);

	return NextResponse.json({ result: propertyValue[0].value });
};

export const PATCH = auth(async (req) => {
	const body = (await req.json()) as Record<string, string>;
	const { property, value } = body;

	if (!property)
		return NextResponse.json({ message: "No se especificó propiedad" });

	const session = req.auth;

	await db
		.update(configurations)
		.set({ value })
		.where(eq(configurations.id, property));

	return NextResponse.json({ message: "Configuración actualizada" });
});
