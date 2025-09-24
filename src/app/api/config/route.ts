import { auth } from "@/auth";
import { db } from "@/lib/db";
import { configurations, history } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export const GET = async (req: NextRequest) => {
	const querys = req.nextUrl.searchParams;

	const property = querys.get("property");

	if (!property)
		return NextResponse.json({ message: "No se especificó propiedad" });

	const [{ value }] = await db
		.select()
		.from(configurations)
		.where(property ? eq(configurations.id, property) : undefined);

	return NextResponse.json({ result: value });
};

export const PATCH = auth(async (req) => {
	if (!req.auth)
		return NextResponse.json({ message: "No autenticado" }, { status: 401 });

	if (req.auth.user.role !== "administrador")
		return NextResponse.json({ message: "No autorizado" }, { status: 401 });

	const body = (await req.json()) as Record<string, string>;
	const { property, value } = body;

	if (!property)
		return NextResponse.json({ message: "No se especificó propiedad" });

	await db.transaction(async (tx) => {
		await tx
			.update(configurations)
			.set({ value })
			.where(eq(configurations.id, property));

		await tx.insert(history).values({
			user_id: req.auth?.user.id ?? "",
			description: "Datos de configuración actualizados",
			action: "MODIFICO",
			reference_id: property,
		});
	});

	return NextResponse.json({ message: "Configuración actualizada" });
});
