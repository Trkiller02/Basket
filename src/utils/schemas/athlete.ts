import * as Yup from "yup";
import { Messages } from "../messages";
import { initValPerson, personSchema } from "./user";
import type { Athlete } from "../interfaces/athlete";

export const initValAthlete: Athlete = {
	birth_date: "",
	age: 0,
	birth_place: "",
	address: "",
	solvent: 0,
	user_id: initValPerson,
};

export const athleteSchema = Yup.object({
	birth_date: Yup.string().datetime().required(Messages.required),
	age: Yup.number().min(3).max(20).required(Messages.required),
	birth_place: Yup.string().required(Messages.required),
	address: Yup.string().required(Messages.required),
	solvent: Yup.number().min(0).max(3).optional(),
	user_id: personSchema,
});
