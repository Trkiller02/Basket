import { RepresentativeService } from "../service";
import type { UpdateRepresentativeDto } from "../dto/update-representative.dto";
import { type NextRequest, NextResponse } from "next/server";
import { representatives, users } from "@drizzle/schema";
import { db } from "@/lib/db";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { MsgError } from "@/utils/messages";
import { regexList } from "@/utils/regexPatterns";
import { auth } from "@/auth";
import { insertHistory } from "@/lib/db-data";

/*
export const representativeController = new Elysia({
	prefix: "/api/representatives",
})
	.onError(({ code, error }) => {
		if (error instanceof Error)
			return Response.json(
				{ error: error.message },
				{ status: typeof code === "number" ? code : 400 },
			);

		return error;
	})
	.decorate("service", new RepresentativeService())
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
			body: UpdateRepresentativeDto,
		},
	)
	.delete("/:id", ({ params: { id }, service }) => service.remove(id));

export const GET = representativeController.handle;
export const PATCH = representativeController.handle;
export const DELETE = representativeController.handle; */

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const querys = req.nextUrl.searchParams;
	const { id } = await params;
	const deleted = querys.get("deleted");
	const forFormView = querys.get("formView");

	const [result] = await db
		.select(
			forFormView
				? {
						id: representatives.id,
					}
				: {
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
					},
		)
		.from(representatives)
		.innerJoin(users, eq(representatives.user_id, users.id))
		.where(
			and(
				eq(
					id?.includes("@")
						? users.email
						: id.match(regexList.forDNI)
							? users.ci_number
							: representatives.id,
					id ?? "",
				),
				deleted ? isNotNull(users.deleted_at) : isNull(users.deleted_at),
			),
		);

	if (!result)
		return NextResponse.json(
			{ message: MsgError.NOT_FOUND },
			{
				status: 404,
			},
		);

	return NextResponse.json(result);
};

export const PATCH = auth(
	async (req, { params }: { params: Promise<{ id: string }> }) => {
		if (!req.auth)
			return NextResponse.json(
				{ message: MsgError.UNAUTHORIZED },
				{ status: 401 },
			);

		const body = (await req.json()) as UpdateRepresentativeDto;
		const { id } = await params;

		if (!body || Object.keys(body).length === 0)
			return NextResponse.json(
				{ message: MsgError.BAD_REQUEST },
				{ status: 400 },
			);

		const [representative] = await db
			.select({
				id: representatives.id,
				user_id: {
					id: users.id,
					email: users.email,
					ci_number: users.ci_number,
				},
			})
			.from(representatives)
			.innerJoin(users, eq(representatives.user_id, users.id))
			.where(
				and(
					eq(
						id?.includes("@")
							? users.email
							: id.includes("-")
								? representatives.id
								: users.ci_number,
						id ?? "",
					),
				),
			);

		if (!representative)
			return NextResponse.json(
				{ message: MsgError.NOT_FOUND },
				{
					status: 404,
				},
			);

		const { user_id, ...restBody } = body;

		if (restBody) {
			await db
				.update(representatives)
				.set(restBody)
				.where(eq(representatives.id, id));
		}

		if (user_id) {
			await db
				.update(users)
				.set(user_id)
				.where(eq(users.id, representative.user_id.id));
		}

		await insertHistory({
			user_id: req.auth?.user.id ?? "",
			action: "MODIFICO",
			description: `Representante ${representative.user_id.ci_number} actualizado`,
		});

		return NextResponse.json({
			message: "Representante actualizado con exito",
		});
	},
);

export const DELETE = auth(
	async (req, { params }: { params: Promise<{ id: string }> }) => {
		const { id } = await params;

		if (!req.auth)
			return NextResponse.json(
				{ message: MsgError.UNAUTHORIZED },
				{ status: 401 },
			);

		if (req.auth.user.role === "representante")
			return NextResponse.json(
				{ message: MsgError.UNAUTHORIZED },
				{ status: 401 },
			);

		const [representative] = await db
			.select({
				id: representatives.id,
				user_id: {
					id: users.id,
					email: users.email,
					ci_number: users.ci_number,
				},
			})
			.from(representatives)
			.innerJoin(users, eq(representatives.user_id, users.id))
			.where(
				and(
					eq(
						id?.includes("@")
							? users.email
							: id.includes("-")
								? representatives.id
								: users.ci_number,
						id ?? "",
					),
				),
			);

		if (!representative)
			return NextResponse.json(
				{ message: MsgError.NOT_FOUND },
				{
					status: 404,
				},
			);

		await db
			.update(users)
			.set({ deleted_at: new Date(Date.now()).toISOString().split("T")[0] })
			.where(eq(users.id, representative.user_id.id));

		await insertHistory({
			user_id: req.auth?.user.id ?? "",
			action: "ELIMINO",
			description: `Representante ${representative.user_id.ci_number} eliminado`,
		});

		return NextResponse.json({
			message: `Representante ${representative.user_id.ci_number} eliminado`,
		});
	},
);
