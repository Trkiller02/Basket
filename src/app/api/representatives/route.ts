import type { CreateRepresentativeDto } from "./dto/create-representative.dto";
import { type NextRequest, NextResponse } from "next/server";
import { representatives, users } from "@drizzle/schema";
import { db } from "@/lib/db";
import { and, eq, ilike, isNotNull, isNull } from "drizzle-orm";

/*
export const representativeController = new Elysia({
	prefix: "/api/representatives",
})
	.decorate("service", new RepresentativeService())
	.onError(({ code, error }) => {
		if (error instanceof Error && error.message)
			return NextResponse.json(
				{ message: error.message },
				{ status: typeof code === "number" ? code : 400 },
			);

		return error;
	})
	.get("/", ({ query, service }) => service.findMany(query), {
		query: t.Optional(
			t.Object({
				query: t.String(),
				page: t.Optional(t.Number()),
				limit: t.Optional(t.Number()),
				deleted: t.Optional(t.Boolean()),
			}),
		),
	})
	.post("/", ({ body, service }) => service.create(body), {
		body: CreateRepresentativeDto,
	});
export const GET = representativeController.handle;
export const POST = representativeController.handle; */

export const GET = async (req: NextRequest) => {
	const querys = req.nextUrl.searchParams;

	const page = querys.get("page");
	const limit = querys.get("limit");
	const query = querys.get("query");
	const deleted = querys.get("deleted");

	const result = await db
		.select({
			id: representatives.id,
			user_id: {
				id: users.id,
				ci_number: users.ci_number,
				name: users.name,
				lastname: users.lastname,
				email: users.email,
				phone_number: users.phone_number,
			},
			occupation: representatives.occupation,
		})
		.from(representatives)
		.innerJoin(users, eq(representatives.user_id, users.id))
		.where(
			and(
				query
					? ilike(
							query?.includes("@") ? users.email : users.ci_number,
							`%${query ?? ""}%`,
						)
					: undefined,
				deleted ? isNotNull(users.deleted_at) : isNull(users.deleted_at),
			),
		)
		.limit(Number(limit ?? 10))
		.offset(Number(page ?? 1) - 1);

	if (result.length === 0)
		return NextResponse.json(
			{ message: "Representantes no encontrados" },
			{
				status: 404,
			},
		);

	return NextResponse.json({ representatives: result });
};

export const POST = async (req: NextRequest) => {
	try {
		const body = (await req.json()) as CreateRepresentativeDto;

		const { user_id, ...rest } = body;

		const [{ userId }] = await db
			.insert(users)
			.values(user_id)
			.returning({ userId: users.id });

		const [{ id }] = await db
			.insert(representatives)
			.values({ ...rest, user_id: userId })
			.returning({ id: representatives.id });

		return NextResponse.json({ message: id }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	}
};
