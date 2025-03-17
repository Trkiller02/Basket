import { Card, CardBody, CardHeader } from "@heroui/card";
import type { Athlete } from "@/utils/interfaces/athlete";
import { redirect } from "next/navigation";
import { Button } from "@heroui/button";
import { Edit2 } from "lucide-react";
import type { Health } from "@/utils/interfaces/health";

export const HealthResume = ({
	data,
	formView,
}: { data: Health; formView?: boolean }) => {
	if (!data) return null;

	return (
		<Card
			as="article"
			className={formView ? "w-full bg-transparent shadow-none" : "w-1/2"}
		>
			<CardHeader className="flex flex-row justify-between">
				<h2 className="text-2xl font-bold" id="health-data">
					Datos de salud:
				</h2>
				<Button
					variant="light"
					isIconOnly
					className=""
					onPress={() =>
						formView ? redirect("/registrar?etapa=salud") : undefined
					}
				>
					<Edit2 className="py-1" />
				</Button>
			</CardHeader>
			<CardBody>
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
			</CardBody>
		</Card>
	);
};
