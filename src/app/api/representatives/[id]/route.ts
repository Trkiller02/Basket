import { Elysia, t } from "elysia";
import { RepresentativeService } from "../service";
import { UpdateRepresentativeDto } from "../dto/update-representative.dto";

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
	.delete("/:id", ({ params: { id }, service }) => service.delete(id));

export const GET = representativeController.handle;
export const PATCH = representativeController.handle;
export const DELETE = representativeController.handle;
