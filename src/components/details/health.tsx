"use client";

import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Edit2 } from "lucide-react";
import type { Health } from "@/utils/interfaces/health";
import Link from "next/link";

export const HealthResume = ({
	data,
	formView,
}: { data: Health; formView?: boolean }) => {
	if (!data) return null;

	return (
		<Card className={formView ? "w-full bg-transparent shadow-none" : "w-1/2"}>
			<CardHeader className="flex flex-row justify-between">
				<CardTitle id="health-data">Datos de salud:</CardTitle>
				<CardAction>
					<Button variant="link" size="icon" asChild>
						<Link
							href={
								formView
									? "/registrar?etapa=salud"
									: `/editar/atleta/${data.athlete_id}`
							}
						>
							<Edit2 className="py-1" />
						</Link>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<ul aria-labelledby="health-data" className="grid grid-cols-3 gap-2">
					<li className="text-foreground-700 font-semibold">
						Autorización medica:{" "}
						<span className="font-normal">
							{data.medical_authorization ? "SI" : "NO"}
						</span>
					</li>
					<li className="text-foreground-700 font-semibold">
						Tipo de sangre:{" "}
						<span className="font-normal">{data.blood_type}</span>
					</li>
					<li className="text-foreground-700 font-semibold">
						Medicamentos:{" "}
						<span className="font-normal">
							{data.takes_medications ?? "NO"}
						</span>
					</li>
					<li className="text-foreground-700 font-semibold">
						Alergias:{" "}
						<span className="font-normal">{data.has_allergies ?? "NO"}</span>
					</li>
					<li className="text-foreground-700 font-semibold">
						Padece asma:{" "}
						<span className="font-normal">{data.has_asthma ? "SI" : "NO"}</span>
					</li>
					<li className="text-foreground-700 font-semibold">
						Lesiones:{" "}
						<span className="font-normal">{data.injuries ?? "NO"}</span>
					</li>
					<li className="text-foreground-700 font-semibold">
						Intervenciones quirurgicas:{" "}
						<span className="font-normal">
							{data.surgical_intervention ?? "NO"}
						</span>
					</li>
					<li className="text-foreground-700 font-semibold">
						Estado actual de salud:{" "}
						<span className="font-normal">
							{data.current_illnesses ?? "No especificado."}
						</span>
					</li>
				</ul>
			</CardContent>
		</Card>
	);
};
