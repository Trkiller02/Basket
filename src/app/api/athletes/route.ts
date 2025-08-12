import type { CreateAthletesDto } from "./dto/create-athletes.dto";
import { athletes, users } from "@drizzle/schema";
import { and, eq, ilike, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { MsgError } from "@/utils/messages";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { NOTIFICATION_MSG, NOTIFICATION_TYPE } from "@/utils/typeNotifications";
import { insertHistory } from "@/lib/db-data";

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

	try {
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
								role: users.role,
							},
							age: athletes.age,
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
	if (!req.auth)
		return NextResponse.json({ message: "No autenticado" }, { status: 401 });

	if (!["secretaria", "administrador"].includes(req.auth.user.role))
		return NextResponse.json({ message: "No autorizado" }, { status: 401 });

	const body = (await req.json()) as CreateAthletesDto;

	const { user_id, ...rest } = body;

	try {
		const [{ userId }] = await db
			.insert(users)
			.values({ ...user_id, id: crypto.randomUUID() })
			.returning({ userId: users.id });

		const [{ id }] = await db
			.insert(athletes)
			.values({ ...rest, user_id: userId })
			.returning({ id: athletes.id });

		await insertHistory({
			user_id: req.auth?.user.id ?? "",
			description: "Datos del atleta creados",
			action: "CREO",
			reference_id: id,
		});

		return NextResponse.json({ message: id }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	}
});
