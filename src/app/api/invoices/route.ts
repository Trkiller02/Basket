import { db } from "@/lib/db";
import { invoices } from "@drizzle/schema";
import { NextResponse } from "next/server";

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
