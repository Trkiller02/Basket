import type { RegisterData } from "@/store/useRegisterStore";

export const getStep = (step: string, data: RegisterData) => {
	let stepToChange: string = "atleta";

	if (data.athlete) stepToChange = "salud";
	if (data.health) stepToChange = "representante";
	if (data.representative) stepToChange = "padre";
	if (data.father) stepToChange = "madre";
	if (data.mother) stepToChange = "resumen";

	return stepToChange;
};
