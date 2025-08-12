import { db } from "@/lib/db";
import { and, between, eq, isNull } from "drizzle-orm";
import { athletes, invoices, representatives, users } from "@drizzle/schema";
import { type NextRequest, NextResponse } from "next/server";
import { MsgError } from "@/utils/messages";
import { getLocalTimeZone, today } from "@internationalized/date";
import { headers } from "next/headers";
import { regexList } from "@/utils/regexPatterns";
import { NOTIFICATION_MSG, NOTIFICATION_TYPE } from "@/utils/typeNotifications";
import { auth } from "@/auth";
import { insertHistory } from "@/lib/db-data";

export const runtime = "nodejs";

export const GET = async (req: NextRequest) => {
	const params = req.nextUrl.searchParams;

	const pageNumber = Number(params.get("page")) || 1;
	const limitNumber = Number(params.get("limit")) || 10;
	const query = params.get("query") ?? "";
	try {
		const result = await db
			.select()
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

export const POST = auth(async (req) => {
	const { representative_id, description, athlete_id, image_path } =
		await req.json();

	const [represent] = await db
		.select({
			id: representatives.id,
			user_id: {
				id: users.id,
			},
		})
		.from(representatives)
		.innerJoin(users, eq(representatives.user_id, users.id))
		.where(
			and(
				eq(
					representative_id.match(regexList.forDNI)
						? users.ci_number
						: users.id,
					representative_id,
				),
				isNull(users.deleted_at),
			),
		);

	if (!represent)
		return NextResponse.json(
			{ message: "Representante no encontrado" },
			{ status: 404 },
		);

	if (Array.isArray(athlete_id)) {
		for (const athleteID of athlete_id) {
			const [{ id: athlete }] = await db
				.select({
					id: athletes.id,
				})
				.from(athletes)
				.innerJoin(users, eq(athletes.user_id, users.id))
				.where(and(eq(users.ci_number, athleteID), isNull(users.deleted_at)));

			const [{ id }] = await db
				.insert(invoices)
				.values({
					representative_id: represent.id,
					description,
					athlete_id: athlete,
					image_path,
				})
				.returning({ id: invoices.id });

			await db
				.update(athletes)
				.set({ solvent: 3 })
				.where(eq(athletes.id, athlete));

			await insertHistory({
				user_id: req.auth?.user.id ?? represent.user_id.id,
				description: `${NOTIFICATION_MSG.PAYMENT} de atleta ${athleteID}`,
				action: "PAGO",
				reference_id: String(id),
			});
		}
	} else {
		const [{ id: athlete }] = await db
			.select({
				id: athletes.id,
			})
			.from(athletes)
			.innerJoin(users, eq(athletes.user_id, users.id))
			.where(and(eq(users.ci_number, athlete_id), isNull(users.deleted_at)));

		const [{ id }] = await db
			.insert(invoices)
			.values({
				representative_id: represent.id,
				description,
				athlete_id: athlete,
				image_path,
			})
			.returning({ id: invoices.id });

		await db
			.update(athletes)
			.set({ solvent: 3 })
			.where(eq(athletes.id, athlete));

		await insertHistory({
			user_id: req.auth?.user.id ?? represent.user_id.id,
			description: `${NOTIFICATION_MSG.PAYMENT} de atleta ${athlete}`,
			action: "PAGO",
			reference_id: String(id),
		});
	}

	return NextResponse.json({ message: "Completado" }, { status: 201 });
	/* } catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	} */
});
