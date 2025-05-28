import { type NextRequest, NextResponse } from "next/server";

import { renderToStream } from "@react-pdf/renderer";
import { db } from "@/lib/db";
import {
	athletes,
	configurations,
	invoices,
	representatives,
	users,
} from "@drizzle/schema";
import { regexList } from "@/utils/regexPatterns";
import { and, eq, isNull, sql, asc } from "drizzle-orm";
import type { Invoices } from "@/utils/interfaces/invoice";
import type { Representative } from "@/utils/interfaces/representative";
import type { Athlete } from "@/utils/interfaces/athlete";
import { InvoicePDF } from "@/components/reports/invoice";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;

	const [[representID], [{ value: pricing }]] = await Promise.all([
		db
			.select({
				id: representatives.id,
				user_id: {
					name: users.name,
					lastname: users.lastname,
					email: users.email,
				},
			})
			.from(representatives)
			.innerJoin(users, eq(representatives.user_id, users.id))
			.where(
				and(
					eq(
						id.match(regexList.forDNI) ? users.ci_number : representatives.id,
						id,
					),
					isNull(users.deleted_at),
				),
			),
		db.select().from(configurations).where(eq(configurations.id, "pricing")),
	]);

	const currentMonth = sql<number>`EXTRACT(MONTH FROM NOW())`;
	const currentYear = sql<number>`EXTRACT(YEAR FROM NOW())`;

	const invoicesResult = await db
		.select()
		.from(invoices)
		.where(
			and(
				eq(invoices.representative_id, representID.id),
				sql`${invoices.payment_date} IS NOT NULL AND EXTRACT(MONTH FROM ${invoices.payment_date}) = ${currentMonth} AND EXTRACT(YEAR FROM ${invoices.payment_date}) = ${currentYear}`,
			),
		)
		.orderBy(asc(invoices.payment_date));

	if (!invoicesResult || invoicesResult.length === 0)
		return NextResponse.json({ message: "No invoices found" }, { status: 404 });

	const athletesResult: Athlete[] = [];
	for (const invoice of invoicesResult) {
		const [athlete] = await db
			.select({
				id: athletes.id,
				user_id: {
					name: users.name,
					lastname: users.lastname,
				},
			})
			.from(athletes)
			.innerJoin(users, eq(athletes.user_id, users.id))
			.where(eq(athletes.id, invoice.athlete_id))
			.orderBy(asc(athletes.id));

		if (athlete) athletesResult.push(athlete as Athlete);
	}

	const stream = await renderToStream(
		<InvoicePDF
			invoiceData={{
				invoices: invoicesResult as Invoices[],
				athletes: athletesResult,
				representative_id: representID as Representative,
				price: +pricing,
			}}
		/>,
	);

	return new NextResponse(stream as unknown as ReadableStream, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="factura_${sampleInvoiceData.invoiceNumber}.pdf"`,
		},
	});
};
