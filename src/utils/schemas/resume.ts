import * as Yup from "yup";
import { athleteSchema } from "./athlete";
import { healthSchema } from "./health";
import { representativeSchema } from "./representative";

export const initValResume = {
	athlete: "",
	health: "",
	representative: "",
	mother: "",
	father: "",
};

export const registerSchema = Yup.object({
	athlete: athleteSchema.optional(),
	health: healthSchema.optional(),
	representative: representativeSchema.optional(),
	mother: Yup.lazy((values) => {
		switch (typeof values) {
			case "object":
				return representativeSchema;
			default:
				return Yup.string().oneOf(["omitted"]).optional();
		}
	}),
	father: Yup.lazy((values) => {
		switch (typeof values) {
			case "object":
				return representativeSchema;
			default:
				return Yup.string().oneOf(["omitted"]).optional();
		}
	}),
});
