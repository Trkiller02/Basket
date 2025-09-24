import { RepresentativeService } from "../service";
import type { UpdateRepresentativeDto } from "../dto/update-representative.dto";
import { type NextRequest, NextResponse } from "next/server";
import { history, representatives, users } from "@drizzle/schema";
import { db } from "@/lib/db";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { MsgError } from "@/utils/messages";
import { regexList } from "@/utils/regexPatterns";
import { auth } from "@/auth";
export const runtime = "nodejs";
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

	if (!result) {
		const [user] = await db
			.select({
				id: users.id,
				ci_number: users.ci_number,
				name: users.name,
				lastname: users.lastname,
				email: users.email,
				phone_number: users.phone_number,
				role: users.role,
			})
			.from(users)
			.where(
				and(
					eq(
						id?.includes("@")
							? users.email
							: id.includes("-")
								? users.id
								: users.ci_number,
						id ?? "",
					),
					deleted ? isNotNull(users.deleted_at) : isNull(users.deleted_at),
				),
			);

		if (user) return NextResponse.json({ user_id: user });

		return NextResponse.json(
			{ message: MsgError.NOT_FOUND },
			{
				status: 404,
			},
		);
	}

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
		const deleted = req.nextUrl.searchParams.get("deleted");

		if (!body || Object.keys(body).length === 0)
			return NextResponse.json(
				{ message: MsgError.BAD_REQUEST },
				{ status: 400 },
			);

		const [representative] = await db
			.select({
				id: representatives.id,
				user_id: users.id,
			})
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

		const [user] = !representative
			? await db
					.select({
						id: users.id,
					})
					.from(users)
					.where(
						and(
							eq(
								id?.includes("@")
									? users.email
									: id.includes("-")
										? users.id
										: users.ci_number,
								id ?? "",
							),
							deleted ? isNotNull(users.deleted_at) : isNull(users.deleted_at),
						),
					)
			: [undefined];

		if (!user && !representative)
			return NextResponse.json(
				{ message: MsgError.NOT_FOUND },
				{
					status: 404,
				},
			);

		const { user_id, ...restBody } = body;

		await db.transaction(async (tx) => {
			if (restBody) {
				if (representative) {
					await tx
						.update(representatives)
						.set(restBody)
						.where(eq(representatives.id, representative.id));
				} else {
					await tx.insert(representatives).values({
						occupation: restBody.occupation ?? "",
						height: restBody.height ?? 150,
						user_id: user?.id ?? "",
					});
				}
			}

			if (user_id) {
				await tx
					.update(users)
					.set(user_id)
					.where(eq(users.id, representative?.user_id ?? user?.id ?? ""));
			}

			await tx.insert(history).values({
				user_id: req.auth?.user.id ?? "",
				action: "MODIFICO",
				description: `Representante ${representative?.user_id ?? user?.id ?? ""} actualizado`,
			});
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

		await db.transaction(async (tx) => {
			await tx
				.update(users)
				.set({ deleted_at: new Date(Date.now()).toISOString().split("T")[0] })
				.where(eq(users.id, representative.user_id.id));

			await tx.insert(history).values({
				user_id: req.auth?.user.id ?? "",
				action: "ELIMINO",
				description: `Representante ${representative.user_id.ci_number} eliminado`,
			});
		});

		return NextResponse.json({
			message: `Representante ${representative.user_id.ci_number} eliminado`,
		});
	},
);
