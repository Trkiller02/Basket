import { db } from "@/lib/db";
import { and, eq, isNull } from "drizzle-orm";
import {
	athletes,
	history,
	invoices,
	representatives,
	users,
} from "@drizzle/schema";
import { type NextRequest, NextResponse } from "next/server";
import { MsgError } from "@/utils/messages";
import { regexList } from "@/utils/regexPatterns";
import { NOTIFICATION_MSG } from "@/utils/typeNotifications";
import { auth } from "@/auth";
import { insertHistory } from "@/lib/db-data";
import type { CreateInvoices } from "@/utils/interfaces/invoice";

export const runtime = "nodejs";

export const GET = auth(async (req: NextRequest) => {
	const params = req.nextUrl.searchParams;

	const pageNumber = Number(params.get("page")) || 1;
	const limitNumber = Number(params.get("limit")) || 10;
	const query = params.get("query") ?? "";
	const toTable = params.get("table") ?? "";
	const verified = params.get("verified");

	try {
		const result = await db
			.select({
				id: invoices.id,
				representative_id: invoices.representative_id,
				athlete_id: invoices.athlete_id,
				payment_date: invoices.payment_date,
				...(toTable
					? {
							description: invoices.description,
							image_path: invoices.image_path,
						}
					: {}),
			})
			.from(invoices)
			.where(
				!query
					? undefined
					: and(
							eq(invoices.representative_id, query),
							typeof verified === "object"
								? undefined
								: verified
									? eq(invoices.verified, true)
									: eq(invoices.verified, false),
						),
			)
			.limit(limitNumber)
			.offset(pageNumber - 1);

		if (result.length === 0)
			return NextResponse.json(
				{ message: MsgError.NOT_FOUND_MANY },
				{ status: 404 },
			);

		const AthletesList = new Map<string, string>();
		const RepresentativesList = new Map<string, string>();

		for (const invoice of result) {
			if (!AthletesList.has(invoice.athlete_id)) {
				const [athlete] = await db
					.select({
						ci_number: users.ci_number,
					})
					.from(athletes)
					.innerJoin(users, eq(athletes.user_id, users.id))
					.where(and(eq(athletes.id, invoice.athlete_id)));

				AthletesList.set(invoice.athlete_id, athlete.ci_number);
			}

			if (!RepresentativesList.has(invoice.representative_id)) {
				const [representative] = await db
					.select({
						ci_number: users.ci_number,
					})
					.from(representatives)
					.innerJoin(users, eq(representatives.user_id, users.id))
					.where(and(eq(representatives.id, invoice.representative_id)));

				RepresentativesList.set(
					invoice.representative_id,
					representative.ci_number,
				);
			}
		}

		const resultWithCI = result.map((invoice) => ({
			...invoice,
			athlete_id: AthletesList.get(invoice.athlete_id) ?? invoice.athlete_id,
			representative_id:
				RepresentativesList.get(invoice.representative_id) ??
				invoice.representative_id,
		}));

		return NextResponse.json({
			result: resultWithCI,
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
});

export const POST = auth(async (req) => {
	const { representative_id, description, athlete_id, image_path } =
		(await req.json()) as CreateInvoices;

	const athletesNotFound = new Set<string>();

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

			if (!athlete) {
				athletesNotFound.add(athlete);
				continue;
			}

			await db.transaction(async (tx) => {
				const [{ id }] = await tx
					.insert(invoices)
					.values({
						representative_id: represent.id,
						description,
						athlete_id: athlete,
						image_path,
					})
					.returning({ id: invoices.id });

				await tx
					.update(athletes)
					.set({ solvent: 3 })
					.where(eq(athletes.id, athlete));

				await tx.insert(history).values({
					user_id: req.auth?.user.id ?? represent.user_id.id,
					description: `${NOTIFICATION_MSG.PAYMENT} de atleta ${athleteID}`,
					action: "PAGO",
					reference_id: String(id),
				});
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

		if (!athlete)
			return NextResponse.json(
				{ message: "Atleta no encontrado" },
				{ status: 404 },
			);

		await db.transaction(async (tx) => {
			const [{ id }] = await tx
				.insert(invoices)
				.values({
					representative_id: represent.id,
					description,
					athlete_id: athlete,
					image_path,
				})
				.returning({ id: invoices.id });

			await tx
				.update(athletes)
				.set({ solvent: 3 })
				.where(eq(athletes.id, athlete));

			await tx.insert(history).values({
				user_id: req.auth?.user.id ?? represent.user_id.id,
				description: `${NOTIFICATION_MSG.PAYMENT} de atleta ${athlete}`,
				action: "PAGO",
				reference_id: String(id),
			});
		});
	}

	if (athletesNotFound.size > 0)
		return NextResponse.json(
			{
				message: `No se pudo procesar los atletas: ${[...athletesNotFound].join(", ")}`,
			},
			{ status: 404 },
		);

	return NextResponse.json({ message: "Completado" }, { status: 201 });
	/* } catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	} */
});
