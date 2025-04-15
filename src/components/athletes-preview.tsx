import { fetchData } from "@/utils/fetchHandler";
import type { Athlete } from "@/utils/interfaces/athlete";
import { getInvoiceStatus } from "@/utils/invoiceHelper";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { CircleCheck, CircleX, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AthletesPreview({ userId }: { userId?: string }) {
	if (!userId) return <div>Inicie sesión para ver los atletas</div>;

	const athletes = await fetchData<{ result: Athlete[] }>(
		`/api/repr-athletes/${userId}`,
	);

	if (athletes?.result.length === 0)
		return <div>No hay atletas registrados</div>;

	return (
		<section className="flex flex-row gap-2">
			{athletes?.result.map((athlete) => (
				<Card as="article" key={athlete.id}>
					<CardHeader className="inline-flex gap-2 items-center">
						<div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-50 hover:bg-gray-100">
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
						<Chip
							className="self-start"
							color={
								[1, 2].includes(athlete.solvent ?? 0) ? "success" : "danger"
							}
							startContent={
								[1, 2].includes(athlete.solvent ?? 0) ? (
									<CircleCheck className="py-2" />
								) : (
									<CircleX className="py-2" />
								)
							}
						>
							{getInvoiceStatus(athlete.solvent)}
						</Chip>
					</CardHeader>
					<CardBody>
						<ul aria-labelledby="personal-data" className="flex flex-col gap-2">
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
					{athlete.solvent === 0 && (
						<CardFooter>
							<Button as={Link} href="/pagos">
								Enviar pago
							</Button>
						</CardFooter>
					)}
				</Card>
			))}
		</section>
	);
}
