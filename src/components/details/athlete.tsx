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
			<CardHeader className="pb-4 relative">
				<div className="space-y-4">
					<CardTitle className="flex items-center gap-3 text-2xl pl-2">
						<User className="h-6 w-6" />
						Información Personal
					</CardTitle>
					<div className="flex items-center gap-6 relative">
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

						<CardDescription className="flex-1 md:text-left">
							<p className="font-semibold text-lg">
								{user_id.lastname}
								<span className="font-medium text-muted-foreground block text-lg">
									{user_id.name}
								</span>
							</p>
						</CardDescription>
					</div>
				</div>

				<div className="flex items-center gap-4 absolute right-0 top-0 mx-4">
					{restData.category && (
						<Badge variant="secondary">{restData.category}</Badge>
					)}
					{restData.position && (
						<Badge variant="outline">{restData.position}</Badge>
					)}
					<CardAction>
						<Button variant="ghost" size="icon" asChild>
							<Link
								href={
									formView
										? "/registrar?etapa=atleta"
										: `/editar/atleta/${data.id}`
								}
							>
								<Edit2 />
							</Link>
						</Button>
					</CardAction>
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
