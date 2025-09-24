import { auth } from "@/auth";
import { db } from "@/lib/db";
import { history, invoices, representatives } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const GET = auth(
	async (req, { params }: { params: Promise<{ id: string }> }) => {
		const { id } = await params;

		try {
			const [invoice] = await db
				.select()
				.from(invoices)
				.where(eq(invoices.id, +id));

			if (!invoice) {
				return NextResponse.json(
					{ message: "Factura no encontrada" },
					{ status: 404 },
				);
			}

			if (req.auth?.user.role === "representante") {
				const [{ id: representative }] = await db
					.select({
						id: representatives.id,
					})
					.from(representatives)
					.where(eq(representatives.user_id, req.auth.user.id ?? ""));

				if (representative !== invoice.representative_id)
					return NextResponse.json(
						{ message: "No tienes permiso para ver esta factura" },
						{ status: 403 },
					);
			}
			return NextResponse.json(invoice, {
				status: 200,
			});
		} catch (error) {
			return NextResponse.json(
				{ message: (error as Error).message },
				{ status: 400 },
			);
		}
	},
);

export const PATCH = auth(
	async (req, { params }: { params: Promise<{ id: string }> }) => {
		const { body } = await req.json();
		const { id } = await params;

		if (!body || Object.keys(body).length === 0)
			return NextResponse.json(
				{ message: "Datos no especificados" },
				{ status: 400 },
			);

		await db.transaction(async (tx) => {
			await tx.update(invoices).set(body).where(eq(invoices.id, +id));

			await tx.insert(history).values({
				user_id: req.auth?.user.id ?? "",
				description: `Datos de factura actualizados para ${id}`,
				action: "MODIFICO",
				reference_id: id,
			});
		});

		return NextResponse.json({ message: "Datos actualizados" });
	},
);
