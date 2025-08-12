import { db } from "@/lib/db";
import { history } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;

	const result = await db.query.history.findFirst({
		where: eq(history.id, Number.parseInt(id)),
		with: {
			user: true,
		},
	});

	return NextResponse.json(result);
};
