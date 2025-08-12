import type { User } from "./user";

export type Athlete = {
	id?: string;
	age: number;
	address: string;
	birth_date: string;
	birth_place: string;
	category?: string;
	position?: string;
	solvent?: number;
	user_id: Omit<
		User,
		"password" | "repeat_password" | "restore_code" | "id" | "role"
	>;
};

export interface DataRequest
	extends Partial<Pick<Athlete, "solvent" | "age" | "category" | "position">>,
		Pick<User, "name" | "lastname" | "email" | "phone_number" | "ci_number"> {
	id: string;
	role_id?: string;
}

export interface AthleteResultRepr {
	id: string;
	user_id: {
		id: string;
		ci_number: string;
		name: string;
		lastname: string;
	};
	solvent: number;
	category?: string | null;
	position?: string | null;
}

export interface UserTable
	extends Omit<User, "password" | "repeat_password" | "restore_code">,
		Partial<Pick<Athlete, "category" | "position" | "solvent">> {}
