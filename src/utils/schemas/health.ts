import * as Yup from "yup";

export const initValHealth = {
	medical_authorization: false,
	blood_type: "",
	has_allergies: false,
	takes_medications: false,
	surgical_intervention: false,
	injuries: false,
	current_illnesses: "",
	has_asthma: false,
};

export const healthSchema = Yup.object({
	medical_authorization: Yup.boolean().required(),
	blood_type: Yup.string().required(),
	has_allergies: Yup.boolean().required(),
	takes_medications: Yup.boolean().required(),
	surgical_intervention: Yup.boolean().required(),
	injuries: Yup.boolean().required(),
	current_illnesses: Yup.string().required(),
	has_asthma: Yup.boolean().required(),
});
