/* import { createInsertSchema } from "drizzle-typebox"; */
import type { athletes } from "@drizzle/schema";
import type { CreateUserDto } from "@api/users/dto/create-user.dto";

/* export const CreateAthletesDto = createInsertSchema(athletes, {
	user_id: CreateUserDto,
}); */

export type CreateAthletesDto = Omit<
	typeof athletes.$inferInsert,
	"user_id"
> & {
	user_id: CreateUserDto;
};
