import { db } from "@/lib/db";
import { athletes_representatives } from "@drizzle/schema";
import { ilike, or } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (req: Request) => {
	try {
		const { athlete_id, representative_id, relation, tutor } = await req.json();

		const [{ id }] = await db
			.insert(athletes_representatives)
			.values({ athlete_id, representative_id, relation, tutor })
			.returning({ id: athletes_representatives.id });

		return NextResponse.json({ message: id }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	}
};

export const GET = async (req: NextRequest) => {
	try {
		const querys = req.nextUrl.searchParams;
		const query = querys.get("query");
		const fromAthlete = querys.get("athlete");

		const result = await db
			.select()
			.from(athletes_representatives)
			.where(
				fromAthlete
					? ilike(athletes_representatives.athlete_id, `%${fromAthlete}%`)
					: query
						? ilike(athletes_representatives.representative_id, `%${query}%`)
						: undefined,
			);

		return NextResponse.json({ representatives: result });
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	}
};
