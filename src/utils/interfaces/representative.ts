import type { User } from "./user";

export type Representative = {
	id?: string;
	occupation: string;
	height?: number;
	user_id: Omit<User, "password" | "repeat_password" | "restore_code" | "id">;
	tutor?: boolean;
};
