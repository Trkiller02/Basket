import { t } from "elysia";
import { createUpdateSchema } from "drizzle-typebox";
import { representatives } from "@drizzle/schema";
import { UpdateUserDto } from "@api/users/dto/create-user.dto";

export const UpdateRepresentativeDto = createUpdateSchema(representatives, {
	user_id: t.Optional(UpdateUserDto),
});

export type UpdateRepresentativeDto = Omit<
	typeof UpdateRepresentativeDto.static,
	"user_id"
> & {
	user_id?: typeof UpdateUserDto.static;
};
