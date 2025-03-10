import { Elysia, t, NotFoundError, StatusMap } from "elysia";
import { AthletesService } from "./service";
import { CreateAthletesDto } from "./dto/create-athletes.dto";
import { UpdateAthletesDto } from "./dto/update-athletes.dto";

export const athletesController = new Elysia({
	prefix: "/athletes",
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
	});
