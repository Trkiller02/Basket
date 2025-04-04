import { fetchData } from "@/utils/fetchHandler";
import type { Athlete } from "@/utils/interfaces/athlete";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { UserCircle } from "lucide-react";
import Image from "next/image";

export default async function AthletesPreview({ userId }: { userId?: string }) {
	if (!userId) return <div>Inicie sesión para ver los atletas</div>;

	const athletes = await fetchData<{ result: Athlete[] }>(
		`/api/repr-athletes/${userId}`,
	);

	if (athletes?.result.length === 0)
		return <div>No hay atletas registrados</div>;

	return athletes?.result.map((athlete) => (
		<Card as="article" key={athlete.id}>
			<CardHeader className="grid grid-cols-4">
				<div className="col-span-2 inline-flex gap-2 items-center">
					<div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
						{athlete.image ? (
							<Image
								src={athlete.image ?? ""}
								alt="Athlete image"
								fill
								className="object-cover"
							/>
						) : (
							<UserCircle className="w-full aspect-square h-auto text-foreground-700" />
						)}
					</div>
					<h1 className="text-2xl font-bold">
						{athlete.user_id.lastname} <br />
						<span className="text-lg text-default-500 pt-1">
							{athlete.user_id.name}
						</span>
					</h1>
				</div>
			</CardHeader>
			<CardBody>
				<ul aria-labelledby="personal-data" className="grid grid-cols-3">
					<li className="font-semibold text-foreground-700">
						Cedula de Identidad:{" "}
						<span className="font-normal">{athlete.user_id.ci_number}</span>
					</li>
					<li className="font-semibold text-foreground-700">
						Edad: <span className="font-normal">{athlete.age} años</span>
					</li>
					<li className="font-semibold text-foreground-700">
						Categoria: {athlete.category} <br />
					</li>
					<li className="font-semibold text-foreground-700">
						Posición: {athlete.position ?? "No especificado."}
					</li>
				</ul>
			</CardBody>
		</Card>
	));
}
