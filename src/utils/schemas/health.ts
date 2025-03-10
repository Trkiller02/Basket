import * as Yup from "yup";

export const initValHealth = {
	medical_authorization: false,
	blood_type: "",
	has_allergies: "",
	takes_medications: "",
	surgical_intervention: "",
	injuries: "",
	current_illnesses: "",
	has_asthma: false,
};

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
