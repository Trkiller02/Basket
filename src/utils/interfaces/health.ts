export type Health = {
	id?: number;
	athlete_id?: string;
	medical_authorization?: boolean;
	blood_type: string;
	has_allergies?: string;
	takes_medications?: string;
	surgical_intervention?: string;
	injuries?: string;
	current_illnesses?: string;
	has_asthma?: boolean;
};
