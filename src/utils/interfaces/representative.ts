import type { User } from "better-auth/types";

export type Representative = {
	occupation: string;
	height: number;
	user_id: User;
};
