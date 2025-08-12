import type { users } from "@drizzle/schema";

/* import { createInsertSchema, createUpdateSchema } from "drizzle-typebox";
import { t } from "elysia";

export const CreateUserDto = createInsertSchema(users, {
	email: t.String({ format: "email" }),
	phone_number: t.Optional(t.String()),
	role: t.Optional(t.String()),
});

export const UpdateUserDto = createUpdateSchema(users);
 */
export type UpdateUserDto = Partial<
	Omit<
		typeof users.$inferInsert,
		"id" | "created_at" | "updated_at" | "deleted_at"
	>
>;

export type CreateUserDto = Omit<
	typeof users.$inferInsert,
	"created_at" | "updated_at" | "deleted_at" | "id"
> & { password: string };
