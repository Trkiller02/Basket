import { type NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import {
	athletes,
	athletes_representatives,
	representatives,
	users,
} from "@drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { MsgError } from "@/utils/messages";
import type { AthleteResultRepr } from "@/utils/interfaces/athlete";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	const [user] = await db
		.select({
			id: representatives.id,
			user_id: representatives.user_id,
		})
		.from(representatives)
		.where(eq(representatives.user_id, id));

	if (!user)
		return NextResponse.json({ message: MsgError.NOT_FOUND }, { status: 404 });

	const reprAtheletes = await db
		.select()
		.from(athletes_representatives)
		.where(eq(athletes_representatives.representative_id, user.id));

	if (reprAtheletes.length === 0) return NextResponse.json({ result: [] });

	const athletesResult: AthleteResultRepr[] = [];

	for (const athlete of reprAtheletes) {
		const { athlete_id } = athlete;

		const [result] = await db
			.select({
				id: athletes.id,
				user_id: {
					id: users.id,
					ci_number: users.ci_number,
					name: users.name,
					lastname: users.lastname,
				},
				image: athletes.image,
				solvent: athletes.solvent,
				category: athletes.category,
				position: athletes.position,
			})
			.from(athletes)
			.innerJoin(users, eq(athletes.user_id, users.id))
			.where(and(eq(athletes.id, athlete_id), isNull(users.deleted_at)));

		if (!result) continue;

		athletesResult.push(result);
	}

	/* if (athletesResult.length === 0)
		return NextResponse.json(
			{ message: MsgError.NOT_FOUND_MANY },
			{ status: 404 },
		);
 */
	return NextResponse.json({ result: athletesResult });
}
