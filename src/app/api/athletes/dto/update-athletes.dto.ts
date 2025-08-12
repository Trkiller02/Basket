import type { UpdateUserDto } from "@api/users/dto/create-user.dto";
import type { athletes } from "@drizzle/schema";
/* 
import { t } from "elysia";
import { createUpdateSchema } from "drizzle-typebox";
export const UpdateAthletesDto = createUpdateSchema(athletes, {
	user_id: t.Optional(UpdateUserDto),
}); */

export type UpdateAthletesDto = Partial<
	Omit<typeof athletes.$inferInsert, "user_id" | "id"> & {
		user_id: UpdateUserDto;
	}
>;
