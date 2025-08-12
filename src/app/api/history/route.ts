import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export const GET = auth(async (req) => {
	if (!req.auth)
		return NextResponse.json({ error: "No autenticado" }, { status: 401 });

	const searchParams = req.nextUrl.searchParams;
	const limit = Number.parseInt(searchParams.get("l") ?? "10");
	const page = Number.parseInt(searchParams.get("p") ?? "1");
	const query = searchParams.get("q");

	const isQueryHistoryID = query?.includes("-")
		? query?.length === 36
			? false
			: undefined
		: true;

	const result = await db.query.history.findMany({
		where: (table, { eq, or, and }) => {
			if (!query) return undefined;

			if (typeof isQueryHistoryID === "undefined")
				return eq(table.created_at, query);

			return isQueryHistoryID
				? eq(table.id, Number.parseInt(query))
				: eq(table.user_id, query);
		},
		columns: {
			description: false,
		},
		limit,
		offset: limit * (page - 1),
		orderBy: (table, { desc }) => [desc(table.created_at)],
	});

	return NextResponse.json({ result, page, limit });
});
