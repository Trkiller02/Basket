import * as Yup from "yup";
import { Messages } from "../messages";
import { regexList } from "../regexPatterns";
import type { User } from "../interfaces/user";

export const initValPerson: User = {
	name: "",
	lastname: "",
	phone_number: "+584",
	ci_number: "V",
	email: "",
};

export const initValUser: User & { password: string; repeat_password: string } =
	{
		name: "",
		lastname: "",
		phone_number: "+584",
		ci_number: "V",
		email: "",
		password: "",
		repeat_password: "",
	};

export const userSchema = Yup.object().shape({
	name: Yup.string()
		.matches(regexList.onlyString, Messages.match_err)
		.required(Messages.required),
	lastname: Yup.string()
		.matches(regexList.onlyString, Messages.match_err)
		.required(Messages.required),
	phone_number: Yup.string()
		.optional()
		.matches(regexList.forPersonalPhoneNumber, Messages.phone_format),
	ci_number: Yup.string()
		.matches(regexList.forDNI, Messages.dni_match)
		.required(Messages.required),
	email: Yup.string().email(Messages.email_err).required(Messages.required),
	password: Yup.string()
		.required(Messages.required)
		.min(4, Messages.min_err)
		.max(32, Messages.max_err),
	repeat_password: Yup.string()
		.required(Messages.required)
		.min(4, Messages.min_err)
		.max(32, Messages.max_err)
		.oneOf([Yup.ref("password")], Messages.match_err),
});

export const personSchema = userSchema.omit(["password", "repeat_password"]);
