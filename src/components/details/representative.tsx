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
import { Briefcase, Edit2, Mail, Phone, Ruler, Users } from "lucide-react";
import { memo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

function RepresentativeResume({
	data,
	formView,
	entity,
}: {
	data: Representative;
	formView?: boolean;
	entity?: string;
}) {
	if (!data) return null;

	const { user_id, ...restData } = data;

	return (
		<Card className="w-full">
			<CardHeader className="pb-6">
				<div className="flex items-center gap-6">
					<Avatar className="h-20 w-20">
						<AvatarImage
							src={user_id.image || "/placeholder.svg"}
							alt={`${user_id.name} ${user_id.lastname}`}
						/>
						<AvatarFallback className="text-xl font-semibold">
							{user_id.name[0]}
							{user_id.lastname[0]}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 space-y-2">
						<CardAction>
							<Button variant="link" size="icon" asChild>
								<Link
									href={
										formView
											? `/registrar?etapa=${entity ?? "representante"}`
											: `/editar/representante/${data.id}`
									}
								>
									<Edit2 className="py-1" />
								</Link>
							</Button>
						</CardAction>
						<CardTitle className="flex items-center gap-3 text-xl">
							<Users className="h-6 w-6" />
							Información del Representante
						</CardTitle>
						<CardDescription className="text-base font-medium">
							{user_id.name} {user_id.lastname}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

						<div className="flex items-center gap-4">
							<Briefcase className="h-6 w-6 text-muted-foreground" />
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Ocupación
								</p>
								<p className="text-base font-semibold">{restData.occupation}</p>
							</div>
						</div>

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
			</CardContent>
		</Card>
	);
}

export default memo(RepresentativeResume);
