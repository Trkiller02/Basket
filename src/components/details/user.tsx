"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Mail, Phone, BadgeIcon as IdCard } from "lucide-react";
import Link from "next/link";
import type { User } from "@/utils/interfaces/user";

const roleColors = {
	administrador: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
	representante:
		"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
	secretaria:
		"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	atleta:
		"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export function UserCard({ user }: { user: User }) {
	const initials =
		`${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
			<div className="max-w-4xl mx-auto">
				<Card className="w-full shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
					<CardHeader className="pb-8 pt-8">
						<div className="flex justify-between items-start mb-6">
							<div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
								<Edit className="h-4 w-4" />
								<span>Perfil de Usuario</span>
							</div>
							<div className="flex space-x-3">
								<Button
									variant="outline"
									className="flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-blue-950"
									asChild
								>
									<Link href={`/editar/usuario/${user.id}`}>
										<Edit className="h-4 w-4" />
										<span>Editar</span>
									</Link>
								</Button>
								<Button
									variant="outline"
									className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
									onClick={() => console.log("eliminar")}
								>
									<Trash2 className="h-4 w-4" />
									<span>Eliminar</span>
								</Button>
							</div>
						</div>

						<div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
							<Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white dark:border-gray-700 shadow-lg">
								<AvatarImage
									src={user.image || "/placeholder.svg"}
									alt="profile-image"
								/>
								<AvatarFallback className="text-4xl md:text-5xl font-bold bg-gray-300 text-white">
									{initials}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1 text-center md:text-left">
								<h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
									{user.name} {user.lastname}
								</h1>
								{user.role && (
									<Badge
										variant="secondary"
										className={`text-lg px-4 py-2 capitalize ${roleColors[user.role]}`}
									>
										{user.role}
									</Badge>
								)}
							</div>
						</div>
					</CardHeader>

					<CardContent className="pb-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
								<div className="flex items-center space-x-3 mb-2">
									<IdCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
										Cédula de Identidad
									</span>
								</div>
								<p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
									{user.ci_number}
								</p>
							</div>

							<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
								<div className="flex items-center space-x-3 mb-2">
									<Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
										Correo Electrónico
									</span>
								</div>
								<p className="text-xl font-medium text-gray-900 dark:text-gray-100 break-all">
									{user.email}
								</p>
							</div>

							{user.phone_number && (
								<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
									<div className="flex items-center space-x-3 mb-2">
										<Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
										<span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
											Teléfono
										</span>
									</div>
									<p className="text-xl font-medium text-gray-900 dark:text-gray-100">
										{user.phone_number}
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
