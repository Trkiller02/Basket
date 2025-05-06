"use client";

import {
	getEntityData,
	setEntityData,
	updateEntityData,
} from "@/lib/action-data";
import { fetchData } from "@/utils/fetchHandler";
import type { Athlete } from "@/utils/interfaces/athlete";
import type { CreateInvoices, Invoices } from "@/utils/interfaces/invoice";
import type { Representative } from "@/utils/interfaces/representative";
import { invoiceSchema } from "@/utils/interfaces/schemas";
import { getInvoiceStatusColor } from "@/utils/invoiceHelper";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { addToast } from "@heroui/toast";
import { User } from "@heroui/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Select, SelectItem } from "@heroui/select";

export default function InvoicesForm({
	athleteList,
}: { athleteList?: Athlete[] }) {
	const athleteId = useSearchParams().get("q");

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

	const form = useForm<CreateInvoices>({
		resolver: yupResolver(invoiceSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const athletesIdSolvent = useMemo(
		() =>
			athleteList
				?.filter((athlete) => [1, 2].includes(athlete.solvent || 0))
				.map((item) => item.id ?? ""),
		[athleteList],
	);

	const onSubmit = async (data: CreateInvoices) => {
		const image = await fetchData<{ message: string }>("/api/upload-image", {
			method: "POST",
			body: {
				file: data.image_path,
				name: Date.now().toString(),
				type: "invoices",
			},
		});

		const response = await setEntityData("invoices", {
			...data,
			athlete_id: data.athlete_id.split(","),
			image_path: (image as { message: string }).message,
		});

		if (response)
			addToast({
				title: "Pago enviado",
				description: "¡Gracias por completar el formulario!",
				color: "success",
			});
	};

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			onReset={() => form.reset()}
			id="invoice-form"
			className="flex flex-col  gap-3 w-1/2 border-content2 bg-content1 p-4 rounded-xl shadow-md"
		>
			<h1 className="col-span-2 font-semibold text-2xl">Datos de pago:</h1>
			<div className="flex flex-col items-center gap-4 col-span-2">
				<div className="flex flex-col self-start">
					<h6 className="text-lg font-medium text-default-700">
						Comprobante del pago:
					</h6>
					<p className="text-sm text-gray-500">
						El comprobante debe ser de buena calidad.
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
			{athleteList ? (
				<Controller
					control={form.control}
					name="athlete_id"
					render={({ field, fieldState: { error } }) => (
						<Select
							classNames={{
								base: "h-16",
							}}
							defaultSelectedKeys={athleteId ? [athleteId] : undefined}
							selectionMode="multiple"
							{...field}
							onSelectionChange={(value) => {
								form.setValue("athlete_id", Array.from(value).join(","));
							}}
							items={athleteList}
							isInvalid={!!error}
							errorMessage={error?.message}
							disabledKeys={athletesIdSolvent}
							label="Atleta"
							description="C.I del atleta que desea pagar"
							renderValue={(items) =>
								items.map((item) => (
									<User
										className="pr-4"
										key={item.data?.user_id.ci_number}
										name={`${item.data?.user_id.lastname.split(" ")[0]} ${item.data?.user_id.name.split(" ")[0]}`}
										description={item.data?.user_id.ci_number}
										avatarProps={{
											size: "sm",
											src: item.data?.image,
											alt: item.data?.user_id.name,
											color: getInvoiceStatusColor(item.data?.solvent),
											fallback: item.data?.user_id.name.charAt(0),
										}}
									/>
								))
							}
						>
							{({ user_id, image, solvent }) => (
								<SelectItem
									key={user_id.ci_number}
									textValue={user_id.ci_number}
								>
									<User
										name={`${user_id.lastname.split(" ")[0]} ${user_id.name.split(" ")[0]}`}
										description={user_id.ci_number}
										avatarProps={{
											size: "sm",
											src: image,
											alt: user_id.name,
											color: getInvoiceStatusColor(solvent),
											fallback: user_id.name.charAt(0),
										}}
									/>
								</SelectItem>
							)}
						</Select>
					)}
				/>
			) : (
				<>
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
								onChange={({ target: { value } }) =>
									form.setValue("athlete_id", value)
								}
								defaultValue={athleteId ?? ""}
								isRequired
								label="Atleta C.I:"
								isInvalid={!!error}
								errorMessage={error?.message}
							/>
						)}
					/>
				</>
			)}
			<Controller
				control={form.control}
				name="description"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						label="Descripción:"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			<div className="flex justify-between items-center">
				<Button
					color="warning"
					type="reset"
					disabled={form.formState.isSubmitting}
					size="lg"
					variant="flat"
				>
					Limpiar
				</Button>

				<Button
					size="lg"
					color="primary"
					type="submit"
					isLoading={form.formState.isSubmitting}
				>
					Enviar
				</Button>
			</div>
		</form>
	);
}
