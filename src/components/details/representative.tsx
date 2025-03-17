import type { Representative } from "@/utils/interfaces/representative";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Edit2, UserCircle } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export function RepresentativeResume({
	data,
	formView,
}: { data: Representative; formView?: boolean }) {
	if (!data) return null;
	const { user_id, ...restData } = data;

	return (
		<Card
			as="article"
			className={formView ? "w-full bg-transparent shadow-none" : "w-1/2"}
		>
			<CardHeader className="flex flex-row justify-between">
				<div className="gap-2 items-center">
					<h1 className="text-2xl font-bold">
						{user_id.lastname}&nbsp;
						<span className="text-lg text-default-500 pt-1">
							{user_id.name}
						</span>
					</h1>
				</div>
				<Button
					variant="light"
					isIconOnly
					className="mt-2 absolute right-3 top-2 col-end-4"
					onPress={() =>
						formView ? redirect("/registrar?etapa=atleta") : undefined
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
						Telefono:{" "}
						<span className="font-normal">{user_id.phone_number}</span>
					</li>
					<li className="font-semibold text-foreground-700">
						Ocupación:{" "}
						<span className="font-normal">{restData.occupation}</span>
					</li>
				</ul>
			</CardBody>
		</Card>
	);
}
