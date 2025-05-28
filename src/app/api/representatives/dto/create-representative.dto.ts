import { createInsertSchema } from "drizzle-typebox";
import { representatives } from "@drizzle/schema";
import { CreateUserDto } from "@api/users/dto/create-user.dto";

export const CreateRepresentativeDto = createInsertSchema(representatives, {
	user_id: CreateUserDto,
});

export type CreateRepresentativeDto = Omit<
	typeof CreateRepresentativeDto.static,
	"user_id"
> & {
	user_id: typeof CreateUserDto.static;
};
