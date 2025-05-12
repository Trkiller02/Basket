"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { AthletesEditForm } from "./athletes";
import HealthEditForm from "./health";
import type { Athlete } from "@/utils/interfaces/athlete";
import { use } from "react";
import type { Health } from "@/utils/interfaces/health";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

export default function AthleteWrap({
	athletesData,
	healthPromise,
}: { athletesData: Athlete; healthPromise: Promise<Health> }) {
	const router = useRouter();
	const healthData = use<Health>(healthPromise);

	return (
		<Accordion className="w-1/2" variant="splitted" defaultSelectedKeys={["1"]}>
			<AccordionItem key="1" aria-label="Atleta-accordion" title="Atleta">
				<AthletesEditForm data={athletesData} />
				<div className="flex justify-between items-center pt-4">
					<Button onPress={() => router.back()} color="danger">
						Cancelar
					</Button>
					<Button type="submit" color="primary" form="atleta-edit-form">
						Enviar
					</Button>
				</div>
			</AccordionItem>
			<AccordionItem key="2" aria-label="Salud-accordion" title="Salud">
				<HealthEditForm data={healthData} />
				<div className="flex justify-between items-center pt-4">
					<Button onPress={() => router.back()} color="danger">
						Cancelar
					</Button>
					<Button type="submit" color="primary" form="salud-edit-form">
						Enviar
					</Button>
				</div>
			</AccordionItem>
		</Accordion>
	);
}
