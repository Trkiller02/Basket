"use client";

import type { RegisterData } from "@/store/useRegisterStore";
import { formEntities } from "@/utils/selectList";
import { Check, Minus } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const steps = [
	{
		key: "atleta",
		label: "Atleta",
		description: "Información básica del atleta.",
		href: "/registrar?etapa=atleta",
	},
	{
		key: "salud",
		label: "Salud",
		description: "Información sobre la salud del atleta.",
		href: "/registrar?etapa=salud",
	},
	{
		key: "representante",
		description: "Quién representa al atleta.",
		label: "Representante",
		href: "/registrar?etapa=representante",
	},
	{
		key: "madre",
		label: "Madre",
		description: "Datos socio-economicos de la madre del atleta.",
		href: "/registrar?etapa=madre",
	},
	{
		key: "padre",
		label: "Padre",
		description: "Datos socio-economicos del padre del atleta.",
		href: "/registrar?etapa=padre",
	},
	{
		key: "resumen",
		label: "Resumen",
		description: "Resumen del proceso de registro.",
		href: "/registrar?etapa=resumen",
	},
];

export const RowSteps = memo(
	({ etapa, registerData }: { etapa: string; registerData: RegisterData }) => {
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
				<div className="flex flex-col">
					<h5 className="text-xl">Progreso</h5>
					<div className="flex flex-row items-center justify-between gap-4">
						<Progress
							getValueLabel={(value, max) => `${value}/${max}`}
							max={formEntities.size}
							value={omittedStep.size + successStep.size}
						/>
						<span>
							{Math.round(
								((omittedStep.size + successStep.size) / formEntities.size) *
									100,
							)}
							%
						</span>
					</div>
				</div>

				{steps.map((step, index) => (
					<Link
						href={step.href}
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
					</Link>
				))}
			</div>
		);
	},
);
