"use client";

import type { Representative } from "@/utils/interfaces/representative";
import { Button } from "../ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Briefcase,
	Edit2,
	Info,
	Mail,
	Phone,
	Ruler,
	Trash2,
	Users,
} from "lucide-react";
import { memo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

function RepresentativeResume({
	data,
	formView,
	entity,
	onDelete,
}: {
	data: Representative;
	formView?: boolean;
	entity?: string;
	onDelete?: () => void;
}) {
	if (!data) return null;

	const { user_id, ...restData } = data;

	return (
		<Card className="w-full">
			<CardHeader className="pb-4 relative">
				<div className="space-y-4">
					<CardTitle className="flex items-center gap-3 text-2xl pl-2">
						<Users className="h-6 w-6" />
						Información de{" "}
						{entity
							? entity?.charAt(0).toUpperCase() + entity?.slice(1)
							: "Representante"}
					</CardTitle>
					<div className="flex items-center gap-6 relative">
						<Avatar className="h-20 w-20">
							<AvatarImage
								src={user_id.image ?? "/placeholder.svg"}
								alt={`${user_id.name} ${user_id.lastname}`}
							/>
							<AvatarFallback className="text-xl font-semibold">
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
					<CardAction>
						<Button variant="ghost" size="icon" asChild>
							<Link
								href={
									formView
										? `/registrar?etapa=${entity ?? "representante"}`
										: `/editar/representante/${data.id ?? data.user_id.ci_number}`
								}
							>
								<Edit2 className="" />
							</Link>
						</Button>
					</CardAction>
					{onDelete && (
						<CardAction>
							<Button variant="ghost" size="icon" onClick={() => onDelete()}>
								<Trash2 className="" />
							</Button>
						</CardAction>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-8">
				<div className="grid md:grid-cols-2 gap-8">
					<div className="space-y-6">
						<div className="flex items-center gap-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
								<span className="text-sm font-semibold text-primary">CI</span>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Cédula de Identidad
								</p>
								<p className="text-base font-semibold">{user_id.ci_number}</p>
							</div>
						</div>

						{restData.occupation && (
							<div className="flex items-center gap-4">
								<Briefcase className="h-6 w-6 text-muted-foreground" />
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">
										Ocupación
									</p>
									<p className="text-base font-semibold">
										{restData.occupation}
									</p>
								</div>
							</div>
						)}

						{restData.height && (
							<div className="flex items-center gap-4">
								<Ruler className="h-6 w-6 text-muted-foreground" />
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">
										Estatura
									</p>
									<p className="text-base font-semibold">
										{restData.height} cm
									</p>
								</div>
							</div>
						)}
					</div>

					<div className="space-y-6">
						<div className="flex items-center gap-4">
							<Mail className="h-6 w-6 text-muted-foreground" />
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Email
								</p>
								<p className="text-base font-semibold break-all">
									{user_id.email}
								</p>
							</div>
						</div>

						{user_id.phone_number && (
							<div className="flex items-center gap-4">
								<Phone className="h-6 w-6 text-muted-foreground" />
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">
										Teléfono
									</p>
									<p className="text-base font-semibold">
										{user_id.phone_number}
									</p>
								</div>
							</div>
						)}

						{entity && (
							<div className="flex items-center gap-4">
								<Users className="h-6 w-6 text-muted-foreground" />
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">
										Relación
									</p>
									<Badge
										variant="secondary"
										className="capitalize text-sm px-3 py-1"
									>
										{entity}
									</Badge>
								</div>
							</div>
						)}
					</div>
				</div>
				{!formView && !restData.occupation && (
					<Alert variant={"destructive"}>
						<Info className="size-6" />
						<AlertTitle>¡Este perfil no está completo!</AlertTitle>
						<AlertDescription>
							El usuario no ha completado su perfil, se recomienda completarlo
							para que la información sea más precisa.
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}

export default memo(RepresentativeResume);
