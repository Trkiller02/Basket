import * as Yup from "yup";
import { Messages } from "../messages";
import { personSchema } from "./user";
import type { Representative } from "../interfaces/representative";

export const initValRepresentative: Representative = {
	occupation: "",
	height: 0,
	user_id: {
		ci_number: "",
		name: "",
		lastname: "",
		email: "",
		phone_number: "",
	},
};

export const representativeSchema = Yup.object({
	occupation: Yup.string().required(Messages.required),
	height: Yup.number().optional(),
	user_id: personSchema,
});
