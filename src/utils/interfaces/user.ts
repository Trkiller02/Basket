export type User = {
	id: string;
	ci_number: string;
	name: string;
	lastname: string;
	email: string;
	phone_number?: string;
	image?: string;
	password?: string;
	repeat_password?: string;
	restore_code?: string;
	role?: "representante" | "secretaria" | "administrador" | "atleta";
};
export interface ChangePassword {
	ci_number: string;
	restore_code: string;
	repeat_password: string;
	password: string;
}
