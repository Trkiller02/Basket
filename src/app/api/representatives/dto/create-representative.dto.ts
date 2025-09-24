import type { representatives } from "@drizzle/schema";
import type { CreateUserDto } from "@api/users/dto/create-user.dto";

/* 
import { createInsertSchema } from "drizzle-typebox";
export const CreateRepresentativeDto = createInsertSchema(representatives, {
	user_id: CreateUserDto,
});
 */
export type CreateRepresentativeDto = Omit<
	typeof representatives.$inferInsert,
	"user_id"
> & {
	user_id: CreateUserDto;
	tutor?: boolean;
};
