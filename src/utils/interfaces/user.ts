export type User = {
	ci_number: string;
	name: string;
	lastname: string;
	email: string;
	phone_number?: string;
	password?: string;
	repeat_password?: string;
	role?: string;
};
