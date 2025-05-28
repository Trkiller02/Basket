import type { RegisterData } from "@/store/useRegisterStore";
import { formEntities } from "./selectList";
import { useCallback } from "react";

export function useGetStep(
	currentStep:
		| "atleta"
		| "salud"
		| "representante"
		| "madre"
		| "padre"
		| "resumen"
		| string,
	props: { data: RegisterData; backMode?: true },
) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	return useCallback((): string => {
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
	}, [currentStep, props.data, props.backMode]);
}
