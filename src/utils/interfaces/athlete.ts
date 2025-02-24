import type { User } from "./user";

export type Athlete = {
	birth_date: string;
	age: number;
	birth_place: string;
	address: string;
	solvent?: boolean;
	user_id: User;
};
