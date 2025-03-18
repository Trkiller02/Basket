"use client";

import {
	getEntityData,
	setEntityData,
	updateEntityData,
} from "@/lib/action-data";
import { fetchData } from "@/utils/fetchHandler";
import type { Athlete } from "@/utils/interfaces/athlete";
import type { Invoices } from "@/utils/interfaces/invoice";
import type { Representative } from "@/utils/interfaces/representative";
import { invoiceSchema } from "@/utils/schemas/invoice";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { addToast } from "@heroui/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";

export default function InvoicesForm() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const handleIconClick = () => {
		// Trigger the hidden file input when the icon is clicked
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			const lector = new FileReader();
			lector.onload = (evento) => {
				form.setValue("image_path", evento.target?.result?.toString());
			};

			lector.readAsDataURL(file);
		}
	};

	const form = useForm<Invoices>({
		criteriaMode: "firstError",
		mode: "all",
		resolver: yupResolver(invoiceSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const onSubmit = async (data: Invoices) => {
		const [representative, athlete, image] = await Promise.allSettled([
			getEntityData("representatives", data.representative_id),
			getEntityData("athletes", data.athlete_id),
			fetchData<{ message: string }>("/api/upload-image", {
				method: "POST",
				body: {
					file: data.image_path,
					name: Date.now().toString(),
					type: "invoices",
				},
			}),
		]);

		if (
			representative.status === "rejected" ||
			athlete.status === "rejected" ||
			image.status === "rejected"
		) {
			addToast({
				title: "Error al guardar pago",
				description: representative.reason ?? athlete.reason ?? image.reason,
				color: "danger",
			});
		}

		if (
			image.status === "fulfilled" &&
			representative.status === "fulfilled" &&
			athlete.status === "fulfilled"
		) {
			const response = await setEntityData("invoices", {
				...data,
				athlete_id: (athlete.value as Athlete).id,
				representative_id: (representative.value as Representative).id,
				image_path: (image.value as { message: string }).message,
			});

			if (response) {
				const sendInfo = await updateEntityData(
					"athletes",
					(athlete.value as Athlete).id!,
					{
						solvent: 1,
					},
				);

				if (sendInfo) {
					addToast({
						title: "Pago enviado",
						description: "¡Gracias por completar el formulario!",
						color: "success",
					});
				}
			}
		}
	};
	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			onReset={() => form.reset()}
			className="flex flex-col md:grid grid-cols-2 gap-3 w-1/2 border-content2 bg-content1 p-4 rounded-xl shadow-md"
		>
			<h1 className="col-span-2 font-semibold text-2xl">Datos de pago:</h1>
			<div className="flex flex-col items-center gap-4 col-span-2">
				<div className="flex flex-col self-start">
					<h6 className="text-lg font-medium text-default-700">
						Fotografía del pago:
					</h6>
					<p className="text-sm text-gray-500">
						La fotografía debe ser de buena calidad.
					</p>
				</div>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					className="relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-primary bg-gray-50 hover:bg-gray-100"
					onClick={handleIconClick}
				>
					{form.watch("image_path") ? (
						// Show the uploaded image
						<Image
							src={form.watch("image_path") ?? ""}
							alt="Uploaded image"
							fill
							className="object-cover"
						/>
					) : (
						// Show the upload icon
						<Upload className="h-12 w-12 text-gray-400 py-2" />
					)}
					<input
						{...form.register("image_path")}
						ref={fileInputRef}
						type="file"
						onChange={handleFileChange}
						hidden
						accept="image/*"
					/>
				</div>
			</div>
			<Controller
				control={form.control}
				name="representative_id"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						isRequired
						label="Representante C.I:"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			<Controller
				control={form.control}
				name="athlete_id"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						isRequired
						label="Atleta C.I:"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			<Controller
				control={form.control}
				name="amount"
				render={({ field, fieldState: { error } }) => (
					<NumberInput
						{...field}
						color={error ? "danger" : "default"}
						isRequired
						label="Monto:"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			<Controller
				control={form.control}
				name="description"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						isRequired
						label="Descripción:"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
		</form>
	);
}
