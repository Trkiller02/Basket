import type { User } from "./user";

export type Athlete = {
	image?: string;
	id?: string;
	birth_date: string;
	age: number;
	birth_place: string;
	address: string;
	solvent?: number;
	category?: string;
	position?: string;
	user_id: User;
};

export interface DataRequest
	extends Partial<
			Pick<Athlete, "solvent" | "age" | "image" | "category" | "position">
		>,
		Pick<User, "name" | "lastname" | "email" | "phone_number" | "ci_number"> {
	id: string;
	role_id?: string;
}
