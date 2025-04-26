import type { Athlete } from "@/utils/interfaces/athlete";
import { getInvoiceStatus, getInvoiceStatusColor } from "@/utils/invoiceHelper";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { CircleCheck, CircleX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const AthletesCard = ({ athlete }: { athlete: Athlete }) => (
	<Card as="article">
		<CardHeader className="inline-flex gap-2 items-center">
			<User
				classNames={{
					name: "ml-2 text-lg font-bold",
					description: "ml-2 text-xl font-semibold",
				}}
				avatarProps={{
					src: athlete.image,
					isBordered: true,
					alt: `${athlete.user_id.name} image profile`,
					color: getInvoiceStatusColor(athlete.solvent),
					size: "lg",
				}}
				description={athlete.user_id.name}
				name={athlete.user_id.lastname}
			/>
			{/* <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-50 hover:bg-gray-100">
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
			*/}
			<Tooltip
				content={
					<div className="px-1 py-2">
						<div className="text-small font-bold">
							{getInvoiceStatus(athlete.solvent)}
						</div>
						<div className="text-tiny">
							{[1, 2].includes(athlete.solvent ?? 0)
								? "¡Felicidades!🎉"
								: "¿Desea subir comprobante de pago?"}
						</div>
					</div>
				}
			>
				<Button
					as={Link}
					size="lg"
					color={[1, 2].includes(athlete.solvent ?? 0) ? "success" : "danger"}
					isIconOnly
					href={`/pagos?q=${athlete.id}`}
					variant="flat"
				>
					{[1, 2].includes(athlete.solvent ?? 0) ? (
						<CircleCheck className="py-1" />
					) : (
						<CircleX className="py-1" />
					)}
				</Button>
			</Tooltip>
		</CardHeader>
		<CardBody>
			<ul aria-labelledby="personal-data" className="grid grid-cols-2">
				<Tooltip content="Cedula de identidad" placement="right">
					<li className="font-semibold text-foreground-700" aria-label="CI">
						<span className="font-normal">{athlete.user_id.ci_number}</span>
					</li>
				</Tooltip>
				&nbsp;
				<Tooltip content="Edad" placement="right">
					<li
						className="font-semibold text-foreground-700 justify-self-start"
						aria-label="Edad"
					>
						{athlete.age}&nbsp;años
					</li>
				</Tooltip>
				<Tooltip content="Categoría" placement="right">
					<li
						className="font-semibold text-foreground-700 justify-self-end"
						aria-label="Categoría"
					>
						{athlete.category}
					</li>
				</Tooltip>
			</ul>
		</CardBody>
	</Card>
);
