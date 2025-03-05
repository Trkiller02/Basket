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
	medical_authorization: Yup.boolean().required(),
	blood_type: Yup.string().required(),
	has_allergies: Yup.string().required(),
	takes_medications: Yup.string().required(),
	surgical_intervention: Yup.string().required(),
	injuries: Yup.string().required(),
	current_illnesses: Yup.string().required(),
	has_asthma: Yup.boolean().required(),
});
