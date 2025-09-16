"use client";

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Activity, Edit2, Heart, Shield } from "lucide-react";
import type { Health } from "@/utils/interfaces/health";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export const HealthResume = ({
	data,
	formView,
}: {
	data: Health;
	formView?: boolean;
}) => {
	if (!data) return null;

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Heart className="h-5 w-5 text-red-500" />
					Información Médica
				</CardTitle>
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
				<CardDescription>
					Historial médico y condiciones de salud
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Shield className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Autorización Médica
								</p>
								<Badge
									variant={
										data.medical_authorization ? "default" : "destructive"
									}
								>
									{data.medical_authorization ? "Autorizado" : "No Autorizado"}
								</Badge>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20">
								<span className="text-sm font-bold text-red-600 dark:text-red-400">
									{data.blood_type}
								</span>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Tipo de Sangre</p>
								<p className="font-medium">{data.blood_type}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Activity className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Asma</p>
								<Badge variant={data.has_asthma ? "destructive" : "secondary"}>
									{data.has_asthma ? "Sí" : "No"}
								</Badge>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<p className="text-sm text-muted-foreground mb-1">Alergias</p>
							<p className="font-medium">
								{data.has_allergies || "No especificado"}
							</p>
						</div>

						<div>
							<p className="text-sm text-muted-foreground mb-1">Medicamentos</p>
							<p className="font-medium">
								{data.takes_medications || "Ninguno"}
							</p>
						</div>

						<div>
							<p className="text-sm text-muted-foreground mb-1">
								Intervenciones Quirúrgicas
							</p>
							<p className="font-medium">
								{data.surgical_intervention || "Ninguna"}
							</p>
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<div>
						<p className="text-sm text-muted-foreground mb-1">
							Lesiones Previas
						</p>
						<p className="font-medium">
							{data.injuries || "Ninguna registrada"}
						</p>
					</div>

					<div>
						<p className="text-sm text-muted-foreground mb-1">
							Enfermedades Actuales
						</p>
						<p className="font-medium">{data.current_illnesses || "Ninguna"}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
