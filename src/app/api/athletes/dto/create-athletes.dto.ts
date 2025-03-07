import { createInsertSchema } from "drizzle-typebox";
import { athletes } from "@drizzle/schema";
import { CreateUserDto } from "../../users/dto/create-user.dto";

export const CreateAthletesDto = createInsertSchema(athletes, {
	user_id: CreateUserDto,
});

export type CreateAthletesDto = Omit<
	typeof CreateAthletesDto.static,
	"user_id"
> & {
	user_id: typeof CreateUserDto.static;
};
