export type User = {
	id: string;
	ci_number: string;
	name: string;
	lastname: string;
	email: string;
	phone_number?: string;
	password?: string;
	repeat_password?: string;
	restore_code: string;
	role?: string;
};
export interface ChangePasswod {
	ci_number: string;
	restore_code: string;
	repeat_password: string;
	new_password: string;
}
