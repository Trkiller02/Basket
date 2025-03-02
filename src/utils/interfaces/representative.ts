import type { User } from "./user";

export type Representative = {
	occupation: string;
	height?: number;
	user_id: User;
};
