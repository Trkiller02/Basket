"use client";

import Image from "next/image";
import { Calendar, Mail, MapPin, Phone, User, UserCircle } from "lucide-react";
import type { Athlete } from "@/utils/interfaces/athlete";
import { Edit2 } from "lucide-react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

const AthleteResume = ({
	data,
	formView,
}: {
	data: Athlete;
	formView?: boolean;
}) => {
	if (!data) return null;

	const { user_id, ...restData } = data;

	return (
		<Card className="w-full">
			<CardHeader className="pb-4">
				<CardAction>
					<Button
						variant="ghost"
						size="icon"
						className="mt-2 absolute right-3 top-2 col-end-4"
						asChild
					>
						<Link
							href={
								formView
									? "/registrar?etapa=atleta"
									: `/editar/atleta/${data.id}`
							}
						>
							<Edit2 className="py-1" />
						</Link>
					</Button>
				</CardAction>
				<div className="flex items-center gap-4">
					<Avatar className="h-16 w-16">
						<AvatarImage
							src={user_id.image || "/placeholder.svg"}
							alt={`${user_id.name} ${user_id.lastname}`}
						/>
						<AvatarFallback className="text-lg">
							{user_id.name[0]}
							{user_id.lastname[0]}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Información Personal
						</CardTitle>

						<CardDescription>
							{user_id.name} {user_id.lastname}
						</CardDescription>
					</div>
					<div className="flex gap-2">
						{restData.category && (
							<Badge variant="secondary">{restData.category}</Badge>
						)}
						{restData.position && (
							<Badge variant="outline">{restData.position}</Badge>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
								<span className="text-sm font-medium text-primary">CI</span>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Cédula de Identidad
								</p>
								<p className="font-medium">{user_id.ci_number}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Calendar className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Fecha de Nacimiento
								</p>
								<p className="font-medium">
									{new Date(restData.birth_date).toLocaleDateString("es-ES")} (
									{restData.age} años)
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<MapPin className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Lugar de Nacimiento
								</p>
								<p className="font-medium">{restData.birth_place}</p>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Mail className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Email</p>
								<p className="font-medium">{user_id.email}</p>
							</div>
						</div>

						{user_id.phone_number && (
							<div className="flex items-center gap-3">
								<Phone className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Teléfono</p>
									<p className="font-medium">{user_id.phone_number}</p>
								</div>
							</div>
						)}

						<div className="flex items-center gap-3">
							<MapPin className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Dirección</p>
								<p className="font-medium">{restData.address}</p>
							</div>
						</div>
					</div>
				</div>

				{restData.solvent !== undefined && (
					<>
						<Separator />
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								Estado de Solvencia
							</span>
							<Badge
								variant={restData.solvent === 1 ? "default" : "destructive"}
							>
								{restData.solvent === 1 ? "Solvente" : "No Solvente"}
							</Badge>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
};

export default AthleteResume;
