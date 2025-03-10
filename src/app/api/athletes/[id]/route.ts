import { Elysia, t, NotFoundError, StatusMap } from "elysia";
import { AthletesService } from "../service";
import { CreateAthletesDto } from "../dto/create-athletes.dto";
import { UpdateAthletesDto } from "../dto/update-athletes.dto";

export const athletesController = new Elysia({
	prefix: "/athletes",
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
export const PATCH = athletesController.handle;
