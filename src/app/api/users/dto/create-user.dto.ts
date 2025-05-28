import { createInsertSchema, createUpdateSchema } from "drizzle-typebox";
import { users } from "@drizzle/schema";
import { t } from "elysia";

export const CreateUserDto = createInsertSchema(users, {
	email: t.String({ format: "email" }),
	phone_number: t.Optional(t.String()),
	role: t.Optional(t.String()),
});

export const UpdateUserDto = createUpdateSchema(users);

export type UpdateUserDto = Omit<
	typeof UpdateUserDto.static,
	| "created_at"
	| "updated_at"
	| "email_verified"
	| "two_factor_enabled"
	| "role"
	| "banned"
	| "ban_expires"
	| "ban_reason"
	| "id"
>;

export type CreateUserDto = Required<
	Omit<
		typeof CreateUserDto.static,
		| "created_at"
		| "updated_at"
		| "email_verified"
		| "two_factor_enabled"
		| "phone_number"
		| "role"
		| "banned"
		| "ban_expires"
		| "ban_reason"
		| "id"
	>
> & { phone_number?: string; role?: string };
