import type { RegisterData } from "@/store/useRegisterStore";
import { formEntities } from "./selectList";

export function getStep(
	currentStep:
		| "atleta"
		| "salud"
		| "representante"
		| "madre"
		| "padre"
		| "resumen",
	props: { data: RegisterData; backMode?: true },
): string {
	const stepsArray = Array.from(formEntities);
	const indexCurrent = stepsArray.findIndex((s) => s === currentStep);

	const { data, backMode } = props;

	if (indexCurrent === 0 && backMode) return "atleta";
	if (indexCurrent === stepsArray.length - 1 && !backMode) return "resumen";

	if (backMode) {
		if (currentStep === "resumen" && data?.father === "omitted") {
			return "representante";
		}
		if (currentStep === "padre" && data?.mother === "omitted") {
			return "representante";
		}

		return stepsArray[indexCurrent - 1];
	}

	if (currentStep === "resumen") return "resumen";

	return stepsArray[indexCurrent + 1];
}
