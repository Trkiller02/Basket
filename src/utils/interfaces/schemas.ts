import * as Yup from "yup";
import { Messages } from "../messages";
import { regexList } from "../regexPatterns";
import type { Athlete } from "./athlete";
import type { Representative } from "./representative";
import type { Health } from "./health";
import type { CreateInvoices } from "./invoice";
import type { User } from "./user";

export const userSchema: Yup.ObjectSchema<Omit<User, "id">> = Yup.object({
	name: Yup.string()
		.matches(regexList.onlyString, Messages.MATCH_ERR)
		.min(2, Messages.MIN_ERR)
		.max(50, Messages.MAX_ERR)
		.required(Messages.REQUIRED),
	lastname: Yup.string()
		.matches(regexList.onlyString, Messages.MATCH_ERR)
		.min(2, Messages.MIN_ERR)
		.max(50, Messages.MAX_ERR)
		.required(Messages.REQUIRED),
	phone_number: Yup.string()
		.matches(regexList.forPersonalPhoneNumber, {
			message: Messages.PHONE_FORMAT,
			excludeEmptyString: true,
		})
		.optional(),
	ci_number: Yup.string()
		.matches(regexList.forDNI, Messages.DNI_MATCH)
		.min(8, Messages.MIN_ERR)
		.max(10, Messages.MAX_ERR)
		.required(Messages.REQUIRED),
	email: Yup.string().email(Messages.EMAIL_ERR).required(Messages.REQUIRED),
	image: Yup.string().optional(),
	password: Yup.string()
		.required(Messages.REQUIRED)
		.min(4, Messages.MIN_ERR)
		.max(32, Messages.MAX_ERR),
	repeat_password: Yup.string()
		.required(Messages.REQUIRED)
		.min(4, Messages.MIN_ERR)
		.max(32, Messages.MAX_ERR)
		.oneOf([Yup.ref("password")], Messages.MATCH_ERR),
	restore_code: Yup.string().optional(),
	role: Yup.string()
		.oneOf(["representante", "secretaria", "administrador", "atleta"])
		.optional(),
});

export const authLoginSchema = Yup.object({
	query: Yup.string()
		.matches(regexList.forDNI, Messages.DNI_MATCH)
		.min(8, Messages.MIN_ERR)
		.max(10, Messages.MAX_ERR)
		.required(Messages.REQUIRED),
	password: Yup.string().required(Messages.REQUIRED),
});

export const authRestorePasswordSchema = Yup.object({
	ci_number: Yup.string()
		.matches(regexList.forDNI, Messages.DNI_MATCH)
		.min(8, Messages.MIN_ERR)
		.max(10, Messages.MAX_ERR)
		.required(Messages.REQUIRED),
	restore_code: Yup.string().required(Messages.REQUIRED),
	password: Yup.string()
		.required(Messages.REQUIRED)
		.min(4, Messages.MIN_ERR)
		.max(32, Messages.MAX_ERR),
	repeat_password: Yup.string()
		.required(Messages.REQUIRED)
		.min(4, Messages.MIN_ERR)
		.max(32, Messages.MAX_ERR)
		.oneOf([Yup.ref("password")], Messages.MATCH_ERR),
});

export const userProfileChange: Yup.ObjectSchema<
	Partial<
		Omit<User, "id" | "role" | "image" | "ci_number"> & {
			new_password: string;
		}
	>
> = Yup.object({
	new_password: Yup.string()
		.optional()
		.min(4, Messages.MIN_ERR)
		.max(32, Messages.MAX_ERR),
	repeat_password: Yup.string()
		.optional()
		.min(4, Messages.MIN_ERR)
		.max(32, Messages.MAX_ERR)
		.oneOf([Yup.ref("new_password")], Messages.MATCH_ERR),
}).concat(
	userSchema.omit(["repeat_password", "ci_number", "role", "image"]).partial(),
);

export const representativeProfileChange: Yup.ObjectSchema<
	Partial<{
		occupation?: string;
		height?: number;
		user_id?: Partial<
			Omit<User, "id" | "role" | "image" | "ci_number"> & {
				new_password: string;
			}
		>;
	}>
> = Yup.object({
	occupation: Yup.string().optional(),
	height: Yup.number().optional(),
	user_id: userProfileChange,
});

export const personSchema = userSchema.omit([
	"password",
	"repeat_password",
	"restore_code",
	"role",
]);

export const athleteSchema: Yup.ObjectSchema<Omit<Athlete, "id">> = Yup.object({
	age: Yup.number().min(5).max(20).required(Messages.REQUIRED),
	address: Yup.string().required(Messages.REQUIRED),
	birth_date: Yup.string()
		.matches(
			/^\d{4}-\d{2}-\d{2}$/,
			"La fecha no es válida (debe ser formato AAAA-MM-DD).",
		)
		.required(Messages.REQUIRED),
	birth_place: Yup.string().required(Messages.REQUIRED),
	category: Yup.string().optional(),
	position: Yup.string().optional(),
	solvent: Yup.number().optional(),
	user_id: personSchema,
});

export const representativeSchema: Yup.ObjectSchema<
	Omit<Representative, "id"> & { tutor?: boolean }
> = Yup.object({
	tutor: Yup.boolean().optional(),
	occupation: Yup.string().required(Messages.REQUIRED),
	height: Yup.number().optional(),
	user_id: personSchema,
});

export const healthSchema: Yup.ObjectSchema<Omit<Health, "id" | "athlete_id">> =
	Yup.object({
		medical_authorization: Yup.boolean().optional(),
		blood_type: Yup.string().required(),
		has_allergies: Yup.string().optional(),
		takes_medications: Yup.string().optional(),
		surgical_intervention: Yup.string().optional(),
		injuries: Yup.string().optional(),
		current_illnesses: Yup.string().optional(),
		has_asthma: Yup.boolean().optional(),
	});

export const invoiceSchema: Yup.ObjectSchema<CreateInvoices> = Yup.object({
	representative_id: Yup.string().required(Messages.REQUIRED),
	athlete_id: Yup.string().required(Messages.REQUIRED),
	description: Yup.string().optional(),
	image_path: Yup.string().required(Messages.REQUIRED),
});

export const relationSchema: Yup.ObjectSchema<{
	relation: "madre" | "padre" | "representante";
	value: string;
	tutor?: boolean;
}> = Yup.object({
	relation: Yup.string().oneOf(["madre", "padre", "representante"]).required(),
	value: Yup.string()
		.matches(regexList.forDNI, { message: Messages.DNI_MATCH })
		.required(),
	tutor: Yup.boolean().optional(),
});

export const changePasswordSchema = Yup.object({
	restore_code: Yup.string().required(Messages.REQUIRED),
	ci_number: Yup.string().required(Messages.REQUIRED),
	repeat_password: Yup.string()
		.required(Messages.REQUIRED)
		.min(4, Messages.MIN_ERR)
		.max(32, Messages.MAX_ERR)
		.oneOf([Yup.ref("new_password")], Messages.MATCH_ERR),
	new_password: Yup.string().required(Messages.REQUIRED),
});
