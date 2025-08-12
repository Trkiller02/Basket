import type { representatives } from "@drizzle/schema";
import type { UpdateUserDto } from "@api/users/dto/create-user.dto";

/* 
import { t } from "elysia";
import { createUpdateSchema } from "drizzle-typebox";
export const UpdateRepresentativeDto = createUpdateSchema(representatives, {
	user_id: t.Optional(UpdateUserDto),
}); */

export type UpdateRepresentativeDto = Partial<
	Omit<typeof representatives.$inferInsert, "user_id"> & {
		user_id: UpdateUserDto;
	}
>;
