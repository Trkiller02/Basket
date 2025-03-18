"use client";

import Image from "next/image";
import { UserCircle } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import type { Athlete } from "@/utils/interfaces/athlete";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Edit2 } from "lucide-react";

const AthleteResume = ({
	data,
	formView,
}: { data: Athlete; formView?: boolean }) => {
	if (!data) return null;

	const router = useRouter();

	const { user_id, ...restData } = data;

	return (
		<Card
			as="article"
			className={formView ? "w-full bg-transparent shadow-none" : "w-1/2"}
		>
			<CardHeader className="grid grid-cols-4">
				<div className="col-span-2 inline-flex gap-2 items-center">
					<div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
						{restData.image ? (
							<Image
								src={restData.image ?? ""}
								alt="Athlete image"
								fill
								className="object-cover"
							/>
						) : (
							<UserCircle className="w-full aspect-square h-auto text-foreground-700" />
						)}
					</div>
					<h1 className="text-2xl font-bold">
						{user_id.lastname} <br />
						<span className="text-lg text-default-500 pt-1">
							{user_id.name}
						</span>
					</h1>
				</div>
				<p className="text-lg font-bold">
					Categoria: {restData.category} <br />
					<span className="text-default-500 pt-1">
						Posición: {restData.position ?? "No especificado."}
					</span>
				</p>
				&nbsp;
				<Button
					variant="light"
					isIconOnly
					className="mt-2 absolute right-3 top-2 col-end-4"
					onPress={() =>
						formView
							? router.push("/registrar?etapa=atleta")
							: router.push(`/editar/atleta/${data.id}`)
					}
				>
					<Edit2 className="py-1" />
				</Button>
			</CardHeader>
			<CardBody>
				<ul aria-labelledby="personal-data" className="grid grid-cols-3">
					<li className="font-semibold text-foreground-700">
						Cedula de Identidad:{" "}
						<span className="font-normal">{user_id.ci_number}</span>
					</li>
					<li className="font-semibold text-foreground-700">
						Correo: <span className="font-normal">{user_id.email}</span>
					</li>
					<li className="font-semibold text-foreground-700">
						Fecha de nacimiento:{" "}
						<span className="font-normal">
							{restData.birth_date.split("T")[0]}
						</span>
					</li>
					&nbsp;
					<li className="font-semibold text-foreground-700">
						Telefono:{" "}
						<span className="font-normal">{user_id.phone_number}</span>
					</li>
					<li className="font-semibold text-foreground-700">
						Edad: <span className="font-normal">{restData.age} años</span>
					</li>
					<li className="font-semibold text-foreground-700">
						Lugar de nacimiento:{" "}
						<span className="font-normal">{restData.birth_place}</span>
					</li>
					&nbsp;
				</ul>
			</CardBody>
		</Card>
	);
};

export default AthleteResume;
