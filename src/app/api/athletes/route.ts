import type { CreateAthletesDto } from "./dto/create-athletes.dto";
import { athletes, notifications, users } from "@drizzle/schema";
import { and, eq, ilike, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { MsgError } from "@/utils/messages";
import { auth } from "@/auth";
import { NOTIFICATION_MSG, NOTIFICATION_TYPE } from "@/utils/typeNotifications";

/* export const athletesController = new Elysia({
	prefix: "/athletes",
})
	.onError(({ code, error }) => {
		if (error instanceof Error)
			return Response.json(
				{ error: error.message },
				{ status: typeof code === "number" ? code : 400 },
			);

		return error;
	})
	.decorate("service", new AthletesService())
	.get("/", ({ query, service }) => service.findMany(query), {
		query: t.Object({
			query: t.String(),
			page: t.Optional(t.Number()),
			limit: t.Optional(t.Number()),
			deleted: t.Optional(t.Boolean()),
		}),
	})

	.post("/", ({ body, service }) => service.create(body), {
		body: CreateAthletesDto,
	}); */

export const GET = async (req: NextRequest) => {
	const querys = req.nextUrl.searchParams;

	const page = querys.get("page") ?? 1;
	const limit = querys.get("limit") ?? 10;
	const query = querys.get("query");
	const deleted = querys.get("deleted") === "true";
	const isFormView = querys.get("formView");
	const isChartView = querys.get("chartView");

	try {
		if (isChartView) {
			const result = await db
				.select({
					category: athletes.category,
					count: sql<number>`count(*)`.as("count"),
				})
				.from(athletes)
				.groupBy(athletes.category);

			return NextResponse.json(result);
		}

		const result = await db
			.select(
				isFormView
					? {
							id: athletes.id,
							user_id: {
								id: users.id,
								ci_number: users.ci_number,
								name: users.name,
								lastname: users.lastname,
							},
						}
					: {
							id: athletes.id,
							user_id: {
								id: users.id,
								ci_number: users.ci_number,
								name: users.name,
								lastname: users.lastname,
								email: users.email,
								phone_number: users.phone_number,
							},
							age: athletes.age,
							image: athletes.image,
							category: athletes.category,
							position: athletes.position,
							solvent: athletes.solvent,
						},
			)
			.from(athletes)
			.innerJoin(users, eq(athletes.user_id, users.id))
			.where(
				and(
					query
						? ilike(
								query.includes("@") ? users.email : users.ci_number,
								`%${query}%`,
							)
						: undefined,
					deleted ? isNotNull(users.deleted_at) : isNull(users.deleted_at),
				),
			)
			.limit(Number(limit))
			.offset(Number(page) - 1);

		if (result.length === 0)
			return NextResponse.json(
				{ message: MsgError.NOT_FOUND_MANY },
				{ status: 404 },
			);

		return NextResponse.json({
			result,
			pagination: {
				page,
				total_pages: Math.round(result.length % Number(limit)),
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
	try {
		const body = (await req.json()) as CreateAthletesDto;
		const session = req.auth;

		const { user_id, ...rest } = body;

		const [{ userId }] = await db
			.insert(users)
			.values({ ...user_id, id: crypto.randomUUID(), role: "atleta" })
			.returning({ userId: users.id });

		const [{ id }] = await db
			.insert(athletes)
			.values({ ...rest, user_id: userId })
			.returning({ id: athletes.id });

		await db.insert(notifications).values({
			user_id: session?.user?.id ?? "",
			description: NOTIFICATION_MSG.REGISTER + id,
			type: NOTIFICATION_TYPE.REGISTER,
		});

		return NextResponse.json({ message: id }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	}
});
