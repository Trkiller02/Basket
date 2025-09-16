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
import { regexList } from "@/utils/regexPatterns";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const querys = await req.nextUrl.searchParams;

	const forInvoice = !!querys.get("invoice");
	const forTable = !!querys.get("table");

	const [user] = await db
		.select({
			id: representatives.id,
			user_id: representatives.user_id,
		})
		.from(representatives)
		.innerJoin(users, eq(representatives.user_id, users.id))
		.where(
			and(
				eq(
					id.match(regexList.forDNI) ? users.ci_number : representatives.id,
					id ?? "",
				),
			),
		);

	if (!user)
		return NextResponse.json({ message: MsgError.NOT_FOUND }, { status: 404 });

	const reprAtheletes = await db
		.select()
		.from(athletes_representatives)
		.where(eq(athletes_representatives.representative_id, user.id));

	if (reprAtheletes.length === 0) return NextResponse.json({ result: [] });

	const athletesResult = [];

	for (const athlete of reprAtheletes) {
		const { athlete_id } = athlete;

		const [result] = await db
			.select(
				forInvoice
					? {
							id: athletes.id,
							user_id: {
								id: users.id,
								name: users.name,
								lastname: users.lastname,
								ci_number: users.ci_number,
							},
							solvent: athletes.solvent,
						}
					: forTable
						? {
								id: athletes.id,
								user_id: {
									id: users.id,
									ci_number: users.ci_number,
									image: users.image,
									name: users.name,
									lastname: users.lastname,
									email: users.email,
									phone_number: users.phone_number,
								},
								solvent: athletes.solvent,
								category: athletes.category,
								position: athletes.position,
							}
						: {
								id: athletes.id,
								user_id: {
									id: users.id,
									ci_number: users.ci_number,
									name: users.name,
									lastname: users.lastname,
								},
								solvent: athletes.solvent,
								category: athletes.category,
								age: athletes.age,
							},
			)
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
