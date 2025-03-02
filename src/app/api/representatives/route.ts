import { Elysia, t } from "elysia";
import { RepresentativeService } from "./service";
import { CreateRepresentativeDto } from "./dto/create-representative.dto";
import { NextResponse } from "next/server";

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
export const POST = representativeController.handle;
