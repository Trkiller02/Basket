import { t } from "elysia";
import { createUpdateSchema } from "drizzle-typebox";
import { UpdateUserDto } from "@/users/dto/create-user.dto";
import { athletes } from "@drizzle/schema";

export const UpdateAthletesDto = createUpdateSchema(athletes, {
	user_id: t.Optional(UpdateUserDto),
});

export type UpdateAthletesDto = Omit<
	typeof UpdateAthletesDto.static,
	"user_id"
> & {
	user_id?: typeof UpdateUserDto.static;
};
