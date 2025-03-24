import type { UpdateAthletesDto } from "../dto/update-athletes.dto";

import { type NextRequest, NextResponse } from "next/server";
import { athletes, users } from "@drizzle/schema";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { MsgError } from "@/utils/messages";

/*
export const athletesController = new Elysia({
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
	.get(
		"/:id",
		({ params: { id }, query, service }) => service.findOne(id, query),
		{
			query: t.Object({
				deleted: t.Optional(t.Boolean()),
			}),
		},
	)
	.patch(
		"/:id",
		({ params: { id }, body, service }) => service.update(id, body),
		{
			body: UpdateAthletesDto,
		},
	)
	.delete("/:id", ({ params: { id }, service }) => service.delete(id));
export const GET = athletesController.handle;
export const POST = athletesController.handle;
export const PATCH = athletesController.handle; */

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const querys = req.nextUrl.searchParams;
	const { id } = await params;
	const deleted = querys.get("sdeleted");

	const [result] = await db
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
			address: athletes.address,
			age: athletes.age,
			solvent: athletes.solvent,
		})
		.from(athletes)
		.innerJoin(users, eq(athletes.user_id, users.id))
		.where(
			and(
				eq(
					id?.includes("@")
						? users.email
						: id.includes("-")
							? athletes.id
							: users.ci_number,
					id ?? "",
				),
				deleted ? isNotNull(users.deleted_at) : isNull(users.deleted_at),
			),
		);

	if (!result)
		return NextResponse.json({ message: MsgError.NOT_FOUND }, { status: 404 });

	return NextResponse.json(result);
};

export const PATCH = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const body = (await req.json()) as UpdateAthletesDto;
	const { id } = await params;

	if (!body || Object.keys(body).length === 0)
		throw { message: MsgError.BAD_REQUEST, code: 400 };

	const [athlete] = await db
		.select({
			id: athletes.id,
			user_id: {
				id: users.id,
				email: users.email,
				ci_number: users.ci_number,
			},
		})
		.from(athletes)
		.innerJoin(users, eq(athletes.user_id, users.id))
		.where(
			and(
				eq(
					id?.includes("@")
						? users.email
						: id.includes("-")
							? athletes.id
							: users.ci_number,
					id ?? "",
				),
			),
		);

	if (!athlete)
		return NextResponse.json({ message: MsgError.NOT_FOUND }, { status: 404 });

	const { user_id, ...restBody } = body;

	if (restBody) {
		await db.update(athletes).set(restBody).where(eq(athletes.id, id));
	}

	if (user_id) {
		await db.update(users).set(user_id).where(eq(users.id, athlete.user_id.id));
	}

	return { message: "Atleta actualizado con exito" };
};

export const DELETE = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;

	const [athlete] = await db
		.select({
			id: athletes.id,
			user_id: {
				id: users.id,
				email: users.email,
				ci_number: users.ci_number,
			},
		})
		.from(athletes)
		.innerJoin(users, eq(athletes.user_id, users.id))
		.where(
			and(
				eq(
					id?.includes("@")
						? users.email
						: id.includes("-")
							? athletes.id
							: users.ci_number,
					id ?? "",
				),
			),
		);

	if (!athlete)
		return NextResponse.json({ message: MsgError.NOT_FOUND }, { status: 404 });

	await db
		.update(users)
		.set({ deleted_at: new Date().toISOString() })
		.where(eq(users.id, athlete.user_id.id));

	return { message: `DELETED ${id}` };
};
