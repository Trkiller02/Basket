"use client";

import type { RegisterData } from "@/store/useRegisterStore";
import { formEntities } from "@/utils/selectList";
import { Progress } from "@heroui/progress";
import { cn } from "@heroui/theme";
import { Check, Minus } from "lucide-react";
import { memo, useEffect, useState } from "react";

export const steps = [
	{
		key: "atleta",
		label: "Atleta",
		description: "Información básica del atleta.",
	},
	{
		key: "salud",
		label: "Salud",
		description: "Información sobre la salud del atleta.",
	},
	{
		key: "representante",
		description: "Quién representa al atleta.",
		label: "Representante",
	},
	{
		key: "madre",
		label: "Madre",
		description: "Datos socio-economicos de la madre del atleta.",
	},
	{
		key: "padre",
		label: "Padre",
		description: "Datos socio-economicos del padre del atleta.",
	},
	{
		key: "resumen",
		label: "Resumen",
		description: "Resumen del proceso de registro.",
	},
];

function RowSteps({
	etapa,
	registerData,
}: { etapa: string; registerData: RegisterData }) {
	const [successStep, setSuccessStep] = useState<Set<string>>(new Set());
	const [omittedStep, setOmittedStep] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (registerData.athlete) setSuccessStep((state) => state.add("atleta"));
		if (registerData.health) setSuccessStep((state) => state.add("salud"));
		if (
			registerData.representative &&
			registerData.representative !== "omitted"
		)
			setSuccessStep((state) => state.add("representante"));
		if (registerData.mother && registerData.mother !== "omitted") {
			setSuccessStep((state) => state.add("madre"));
		}

		if (registerData.representative === "omitted")
			setOmittedStep((state) => state.add("representante"));

		if (registerData.mother === "omitted")
			setOmittedStep((state) => state.add("madre"));
		if (registerData.father && registerData.father !== "omitted") {
			setSuccessStep((state) => state.add("padre"));
		}
		if (registerData.father === "omitted")
			setOmittedStep((state) => state.add("padre"));
	}, [registerData]);

	return (
		<div className="flex flex-col gap-2 m-2">
			<h4 className="text-2xl text-primary font-semibold">
				Registro
				<span className="text-base text-default-800 block font-normal">
					Rcuerda suministrar información correcta.
				</span>
			</h4>
			<Progress
				color="primary"
				label="Progreso"
				maxValue={formEntities.size}
				showValueLabel={true}
				size="lg"
				value={omittedStep.size + successStep.size}
			/>

			{steps.map((step, index) => (
				<div
					key={index.toString()}
					className={`bg-content1 flex flex-row items-center justify-start gap-3 p-2 py-4 rounded-2xl border-2 ${etapa === step.key ? "border-primary" : "border-content2"}`}
				>
					<div
						className={cn(
							"w-10 h-10 rounded-full flex border-2 bg-content1 border-content2 items-center justify-center",
							{
								"border-transparent bg-primary": successStep.has(step.key),
								"border-content3 bg-content2": omittedStep.has(step.key),
							},
						)}
					>
						{omittedStep.has(step.key) ? (
							<Minus className="text-default-700 py-1" />
						) : successStep.has(step.key) ? (
							<Check className="text-white py-1" />
						) : (
							<span className="text-default-700 font-bold">
								{Array.from(formEntities).indexOf(step.key) + 1}
							</span>
						)}
					</div>
					<div className="flex flex-col justify-center items-start">
						<div
							className={`text-lg font-medium ${etapa === step.key ? "text-primary" : "text-default-900"}`}
						>
							{step.label}
						</div>
						<div className="text-sm text-default-700">{step.description}</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default memo(RowSteps);
