import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import type { SystemLog } from "@/utils/interfaces/history";
import { sql } from "drizzle-orm";

export const GET = auth(async (req) => {
	if (!req.auth)
		return NextResponse.json({ error: "No autenticado" }, { status: 401 });

	const searchParams = req.nextUrl.searchParams;
	const limit = Number.parseInt(searchParams.get("l") ?? "10");
	const page = Number.parseInt(searchParams.get("p") ?? "1");
	const query = searchParams.get("q");
	const action = searchParams.get("action") as SystemLog["action"] | null;

	const isQueryHistoryID = query?.includes("-")
		? query?.length === 36
			? false
			: undefined
		: true;

	const result = await db.query.history.findMany({
		where: (table, { eq, or, and }) =>
			and(
				!query
					? undefined
					: typeof isQueryHistoryID === "undefined"
						? eq(sql<string>`${table.created_at}::date`, query)
						: isQueryHistoryID
							? eq(table.id, Number.parseInt(query))
							: eq(table.user_id, query),
				action ? eq(table.action, action) : undefined,
			),
		columns: {
			description: false,
		},
		limit,
		offset: limit * (page - 1),
		orderBy: (table, { desc }) => [desc(table.created_at)],
	});

	console.log({ date: new Date(result[0]?.created_at).toISOString() });

	return NextResponse.json({ result, page, limit });
});
