import type { User } from "./user";

export type Representative = {
	id?: string;
	occupation: string;
	height?: number;
	user_id: User;
};
