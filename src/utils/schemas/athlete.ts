import * as Yup from "yup";
import { Messages } from "../messages";
import { personSchema } from "./user";
import type { Athlete } from "../interfaces/athlete";

export const initValAthlete: Athlete = {
	birth_date: "",
	age: 0,
	birth_place: "",
	address: "",
	solvent: false,
	user_id: {
		ci_number: "",
		name: "",
		lastname: "",
		email: "",
		phone_number: "",
	},
};

export const athleteSchema = Yup.object({
	birth_date: Yup.string().datetime().required(Messages.required),
	age: Yup.number().required(Messages.required),
	birth_place: Yup.string().required(Messages.required),
	address: Yup.string().required(Messages.required),
	solvent: Yup.boolean().optional(),
	user_id: personSchema,
});
