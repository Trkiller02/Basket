import * as Yup from "yup";
import { Messages } from "../messages";
import { regexList } from "../regexPatterns";

export const userSchema = Yup.object({
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
		.optional()
		.matches(regexList.forPersonalPhoneNumber, Messages.PHONE_FORMAT),
	ci_number: Yup.string()
		.matches(regexList.forDNI, Messages.DNI_MATCH)
		.min(8, Messages.MIN_ERR)
		.max(10, Messages.MAX_ERR)
		.required(Messages.REQUIRED),
	email: Yup.string().email(Messages.EMAIL_ERR).required(Messages.REQUIRED),
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

export const personSchema = userSchema.omit(["password", "repeat_password"]);

export const athleteSchema = Yup.object({
	birth_date: Yup.string().datetime().required(Messages.REQUIRED),
	age: Yup.number().min(3).max(20).required(Messages.REQUIRED),
	birth_place: Yup.string().required(Messages.REQUIRED),
	address: Yup.string().required(Messages.REQUIRED),
	solvent: Yup.number().min(0).max(3).optional(),
	image: Yup.string().optional(),
	user_id: personSchema,
});

export const representativeSchema = Yup.object({
	occupation: Yup.string().required(Messages.REQUIRED),
	height: Yup.number().optional(),
	user_id: personSchema,
});

export const healthSchema = Yup.object({
	medical_authorization: Yup.boolean().optional(),
	blood_type: Yup.string().required(),
	has_allergies: Yup.string().optional(),
	takes_medications: Yup.string().optional(),
	surgical_intervention: Yup.string().optional(),
	injuries: Yup.string().optional(),
	current_illnesses: Yup.string().optional(),
	has_asthma: Yup.boolean().optional(),
});

export const invoiceSchema = Yup.object({
	representative_id: Yup.string().required(Messages.REQUIRED),
	amount: Yup.number().min(0).required(Messages.REQUIRED),
	athlete_id: Yup.string().required(Messages.REQUIRED),
	description: Yup.string().optional(),
	image_path: Yup.string().optional(),
});
