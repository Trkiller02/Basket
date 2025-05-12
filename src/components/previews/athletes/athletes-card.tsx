"use client";

import type { Athlete } from "@/utils/interfaces/athlete";
import { getInvoiceStatus, getInvoiceStatusColor } from "@/utils/invoiceHelper";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";

import { User2, UserRoundCheck, UserRoundX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const AthletesCard = ({ athlete }: { athlete: Athlete }) => (
	<Badge content="" color={getInvoiceStatusColor(athlete.solvent)} size="lg">
		<Card as={Link} isPressable href={`/pagos?q=${athlete.user_id.ci_number}`}>
			{/* <CardHeader className="inline-flex gap-4 items-center">
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
					href={`/pagos?q=${athlete.user_id.ci_number}`}
					variant="flat"
				>
					{[1, 2].includes(athlete.solvent ?? 0) ? (
						<CircleCheck className="py-1" />
					) : (
						<CircleX className="py-1" />
					)}
				</Button>
			</Tooltip>
		</CardHeader> */}
			<CardBody className="relative overflow-hidden bg-gray-50 hover:bg-gray-100 h-52">
				{athlete.image ? (
					<Image
						src={athlete.image ?? ""}
						alt="Athlete image"
						fill
						className="object-cover"
					/>
				) : (
					<User2 className="w-full aspect-square h-auto text-foreground-700" />
				)}
			</CardBody>
			<CardFooter>
				<ul aria-labelledby="personal-data" className="grid grid-cols-2 w-full">
					<li>
						<h4 className="font-semibold text-lg">
							{athlete.user_id.lastname}
							<span className="text-default-700 text-sm block">
								{athlete.user_id.name}
							</span>
						</h4>
					</li>
					<Tooltip content="Estado de cancelación" placement="right">
						<Chip
							color={getInvoiceStatusColor(athlete.solvent)}
							className="justify-self-end"
							endContent={
								(athlete.solvent ?? 0) > 0 ? (
									<UserRoundCheck className="py-[6px]" />
								) : (
									<UserRoundX className="py-[6px]" />
								)
							}
							variant="flat"
						>
							{getInvoiceStatus(athlete.solvent)}
						</Chip>
					</Tooltip>

					<Tooltip content="Cedula de identidad" placement="bottom">
						<li
							className="font-semibold text-foreground-500 hover:text-foreground-900"
							aria-label="CI"
						>
							{athlete.user_id.ci_number}
						</li>
					</Tooltip>

					{/* {athlete.position && (
					<li
					className="font-semibold text-foreground-700 justify-self-end"
						aria-label="Posición"
					>
						{athlete.position}
					</li>
				)} */}

					<Tooltip content="Categoría en la que participa" placement="bottom">
						<li
							className="font-semibold text-foreground-700 justify-self-end"
							aria-label="Categoría"
						>
							{athlete.category}
						</li>
					</Tooltip>
				</ul>
			</CardFooter>
		</Card>
	</Badge>
);
