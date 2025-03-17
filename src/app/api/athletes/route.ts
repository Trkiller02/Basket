import type { SearchQuery } from "@/utils/interfaces/search";
import type { CreateAthletesDto } from "./dto/create-athletes.dto";
import { athletes, users } from "@drizzle/schema";
import { and, eq, ilike, isNotNull, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

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

	const page = querys.get("page");
	const limit = querys.get("limit");
	const query = querys.get("query");
	const deleted = querys.get("deleted");

	const result = await db
		.select({
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
			solvent: athletes.solvent,
		})
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
		.limit(Number(limit ?? 10))
		.offset(Number(page ?? 1) - 1);

	if (result.length === 0)
		return NextResponse.json(
			{ message: "Atletas no encontrados." },
			{ status: 404 },
		);

	return NextResponse.json({ athletes: result });
};

export const POST = async (req: NextRequest) => {
	try {
		const body = (await req.json()) as CreateAthletesDto;

		const { user_id, ...rest } = body;

		const [{ userId }] = await db
			.insert(users)
			.values(user_id)
			.returning({ userId: users.id });

		const [{ id }] = await db
			.insert(athletes)
			.values({ ...rest, user_id: userId })
			.returning({ id: athletes.id });

		return NextResponse.json({ message: id }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	}
};
