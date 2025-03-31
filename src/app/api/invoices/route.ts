import { db } from "@/lib/db";
import { between, eq } from "drizzle-orm";
import { invoices } from "@drizzle/schema";
import { type NextRequest, NextResponse } from "next/server";
import { MsgError } from "@/utils/messages";
import { getLocalTimeZone, today } from "@internationalized/date";

export const GET = async (req: NextRequest) => {
	const params = req.nextUrl.searchParams;

	const pageNumber = Number(params.get("page")) || 1;
	const limitNumber = Number(params.get("limit")) || 10;
	const query = params.get("query") ?? "";
	const isPayment = params.get("payment") === "true";

	const date = today(getLocalTimeZone());

	try {
		if (isPayment) {
			const result = await db.$count(
				invoices,
				between(
					invoices.payment_date,
					date.subtract({ days: date.day - 1 }).toString(),
					date.toString(),
				),
			);

			return NextResponse.json({
				result,
			});
		}

		const result = await db
			.select({
				payment_date: invoices.payment_date,
				representative_id: invoices.representative_id,
				amount: invoices.amount,
				description: invoices.description,
				athlete_id: invoices.athlete_id,
				image_path: invoices.image_path,
			})
			.from(invoices)
			.where(eq(invoices.representative_id, query))
			.limit(limitNumber)
			.offset(pageNumber - 1);

		if (result.length === 0)
			return NextResponse.json(
				{ message: MsgError.NOT_FOUND_MANY },
				{ status: 404 },
			);

		return NextResponse.json({
			result,
			pagination: {
				page: pageNumber,
				total_pages: Math.round(result.length / limitNumber),
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	}
};

export const POST = async (req: Request) => {
	try {
		const { representative_id, amount, description, athlete_id, image_path } =
			await req.json();

		const [{ id }] = await db
			.insert(invoices)
			.values({
				representative_id,
				amount,
				description,
				athlete_id,
				image_path,
			})
			.returning({ id: invoices.id });

		return NextResponse.json({ message: id }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	}
};
