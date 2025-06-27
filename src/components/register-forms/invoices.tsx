"use client";

import type { Athlete } from "@/utils/interfaces/athlete";
import type { CreateInvoices } from "@/utils/interfaces/invoice";
import { invoiceSchema } from "@/utils/interfaces/schemas";

import { setEntityData } from "@/lib/action-data";
import { fetchData } from "@/utils/fetchHandler";

import { getInvoiceStatus, getInvoiceStatusColor } from "@/utils/invoiceHelper";

import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { Search, X, Upload } from "lucide-react";

import Image from "next/image";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandInput,
	CommandEmpty,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { findEntity } from "@/utils/getEntity";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

export default function InvoicesForm({
	athleteList,
	pricing,
	representId,
}: {
	athleteList?: Pick<Athlete, "user_id" | "solvent" | "id">[];
	pricing: string;
	representId?: string;
}) {
	const athleteId = useSearchParams().get("q");
	const [open, setOpen] = useState(false);

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
				if (evento.target?.result)
					form.setValue("image_path", evento.target.result.toString());
			};

			lector.readAsDataURL(file);
		}
	};

	const form = useForm<CreateInvoices>({
		resolver: yupResolver(invoiceSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

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
			representative_id: representId ?? data.representative_id,
			image_path: (image as { message: string }).message,
		});

		return "Se ha enviado el pago correctamente";
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((values) =>
					toast.promise(onSubmit(values), {
						loading: "Enviando...",
						description: "Por favor espere.",
						success: (data) => {
							return data;
						},
						error: (error) => error.message,
					}),
				)}
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
						<p className="text-sm text-gray-600">
							El comprobante debe ser de buena calidad.
							<span className="text-default-900 font-semibold block">
								Monto: {pricing.toString()} Bs
							</span>
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
							required
							type="file"
							onChange={handleFileChange}
							hidden
							accept="image/*"
						/>
					</div>
					{form.formState.errors.image_path && (
						<p className="text-sm text-danger">
							{form.formState.errors.image_path.message}
						</p>
					)}
				</div>
				{athleteList ? (
					<FormField
						control={form.control}
						name="athlete_id"
						render={({ field }) => {
							const selectedUsers = athleteList.filter((user) =>
								field.value?.includes(user.user_id.ci_number),
							);

							console.log({ valor: field.value, selectedUsers });

							const usersLength = field.value
								?.split(",")
								.filter((n) => n !== "").length;

							return (
								<FormItem>
									<FormLabel>Atleta(s) a cancelar:</FormLabel>
									<FormControl>
										<Popover open={open} onOpenChange={setOpen}>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													// biome-ignore lint/a11y/useSemanticElements: <explanation>
													role="combobox"
													aria-expanded={open}
													className="w-full justify-between h-auto min-h-[40px] p-2"
												>
													<div className="flex items-center gap-2">
														<Search className="h-4 w-4 text-muted-foreground" />
														{field.value?.length > 0 ? (
															<span className="text-sm">
																{usersLength} usuario
																{usersLength !== 1 ? "s" : ""} seleccionado
																{usersLength !== 1 ? "s" : ""}
															</span>
														) : (
															<span className="text-muted-foreground">
																Seleccionar miembros del equipo...
															</span>
														)}
													</div>
													<div className="flex items-center gap-2">
														{usersLength > 0 && (
															<div className="flex -space-x-2">
																{selectedUsers.slice(0, 3).map((user) => (
																	<Avatar
																		key={user.id}
																		className="h-6 w-6 border-2 border-background"
																	>
																		<AvatarImage
																			src={user.user_id.image}
																			alt={user.user_id.name}
																		/>
																		<AvatarFallback className="text-xs">
																			{user.user_id.name
																				.split(" ")
																				.map((n) => n[0])
																				.join("")}
																		</AvatarFallback>
																	</Avatar>
																))}
																{usersLength > 3 && (
																	<div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
																		<span className="text-xs font-medium">
																			+{usersLength - 3}
																		</span>
																	</div>
																)}
															</div>
														)}
														<span className="ml-2 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold dark:bg-slate-700">
															{usersLength || 0}
														</span>
													</div>
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0" align="start">
												<Command>
													<CommandInput placeholder="Buscar por nombre o email..." />
													<CommandList>
														<CommandEmpty>
															No se encontraron usuarios.
														</CommandEmpty>
														<CommandGroup>
															{athleteList.map((user) => {
																const isSelected = field.value
																	?.split(",")
																	.includes(user.user_id.ci_number);

																const isDisabled = user.solvent !== 0;

																return (
																	<CommandItem
																		key={user.user_id.ci_number}
																		onSelect={(value) => {
																			if (isDisabled) return; // Prevenir selección de usuarios deshabilitados

																			const currentValues = new Set(
																				field.value
																					?.split(",")
																					.filter((n) => n !== "") || [],
																			);

																			if (isSelected) {
																				currentValues.delete(
																					user.user_id.ci_number,
																				);
																				field.onChange(
																					Array.from(currentValues).join(","),
																				);
																			} else {
																				currentValues.add(
																					user.user_id.ci_number,
																				);
																				field.onChange(
																					Array.from(currentValues).join(","),
																				);
																			}
																		}}
																		className={`flex items-center gap-3 p-3 ${
																			isDisabled
																				? "opacity-50 cursor-not-allowed"
																				: "cursor-pointer"
																		}`}
																		disabled={isDisabled}
																	>
																		<div
																			className={cn(
																				"flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary",
																				isDisabled &&
																					"opacity-50 [&_svg]:invisible",
																			)}
																		>
																			{isSelected && !isDisabled && (
																				<span className="h-2 w-2 rounded-full bg-current" />
																			)}
																		</div>
																		<Avatar
																			className={`h-8 w-8 ${isDisabled ? "grayscale" : ""}`}
																		>
																			<AvatarImage
																				src={user.user_id.image}
																				alt={user.user_id.name}
																			/>
																			<AvatarFallback>
																				{user.user_id.name
																					.split(" ")
																					.map((n) => n[0])
																					.join("")}
																			</AvatarFallback>
																		</Avatar>
																		<div className="flex-1 min-w-0">
																			<div className="flex items-center space-x-2">
																				<p className="text-sm font-medium truncate">
																					{user.user_id.name}
																				</p>
																				<div
																					className={cn(
																						"w-2 h-2 rounded-full",
																						`bg-${getInvoiceStatusColor(user.solvent ?? 0)}`,
																					)}
																				/>
																			</div>
																			<p className="text-xs text-muted-foreground truncate">
																				{user.user_id.email}
																			</p>
																			{isDisabled && (
																				<p
																					className={`text-xs text-${getInvoiceStatusColor(user.solvent)} truncate`}
																				>
																					{getInvoiceStatus(user.solvent)}
																				</p>
																			)}
																		</div>
																	</CommandItem>
																);
															})}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
									</FormControl>

									{field.value?.split(",").length > 0 && (
										<div className="space-y-2">
											<div className="text-sm font-medium">
												Usuarios seleccionados:
											</div>
											<div className="flex flex-wrap gap-2">
												{selectedUsers.map((user) => (
													<Badge
														key={user.user_id.ci_number}
														variant="secondary"
														className="flex items-center gap-2 pr-1 pl-1"
													>
														<Avatar className="h-4 w-4">
															<AvatarImage
																src={user.user_id.image}
																alt={user.user_id.name}
															/>
															<AvatarFallback className="text-[0.50rem]">
																{user.user_id.name
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</AvatarFallback>
														</Avatar>
														<span className="text-xs font-medium">
															{user.user_id.name}
														</span>
														<button
															type="button"
															className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted"
															onClick={() => {
																const currentValues = new Set(
																	field.value
																		.split(",")
																		.filter((n) => n !== "") || [],
																);

																currentValues.delete(user.user_id.ci_number);

																field.onChange(
																	Array.from(currentValues).join(","),
																);
															}}
														>
															<X className="h-3 w-3" />
														</button>
													</Badge>
												))}
											</div>
										</div>
									)}

									<FormMessage />
								</FormItem>
							);
						}}
					/>
				) : (
					<>
						{/* CI REPRESENT FIELD */}
						<FormField
							control={form.control}
							name="representative_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cédula de identidad del representante:</FormLabel>
									<FormControl>
										<div className="flex items-center gap-2 w-full">
											<Select
												onValueChange={(value) =>
													field.onChange(value + (field.value?.slice(1) ?? ""))
												}
												defaultValue={field.value?.charAt(0) ?? "V"}
											>
												<SelectTrigger>
													<SelectValue placeholder="V" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="V">V</SelectItem>
													<SelectItem value="E">E</SelectItem>
												</SelectContent>
											</Select>
											<div className="relative">
												<Input
													placeholder="3..."
													type="tel"
													className="peer pe-9"
													required
													defaultValue={field.value?.slice(1) ?? ""}
													onChange={({ target: { value: number } }) =>
														field.onChange(field.value?.slice(0, 1) + number)
													}
												/>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															disabled={!field.value}
															type="button"
															size="icon"
															variant="link"
															aria-label="Buscar entidad"
															className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground/80 peer-disabled:opacity-50"
															onClick={() =>
																toast.promise(findEntity(field.value ?? ""), {
																	loading: "Verificando si existe...",
																	success: (data) => {
																		return {
																			message: "Registro encontrado",
																		};
																	},
																	error: (error) => error.message,
																})
															}
														>
															<Search />
														</Button>
													</TooltipTrigger>
													<TooltipContent>Buscar registro</TooltipContent>
												</Tooltip>
											</div>
										</div>
									</FormControl>
									<FormDescription>Prefijo: V o E. Ej: V30...</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* CI ATHLETE FIELD */}
						<FormField
							control={form.control}
							name="athlete_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cédula de identidad del atleta:</FormLabel>
									<FormControl>
										<div className="flex items-center gap-2 w-full">
											<Select
												onValueChange={(value) =>
													field.onChange(value + (field.value?.slice(1) ?? ""))
												}
												defaultValue={field.value?.charAt(0) ?? "V"}
											>
												<SelectTrigger>
													<SelectValue placeholder="V" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="V">V</SelectItem>
													<SelectItem value="E">E</SelectItem>
												</SelectContent>
											</Select>
											<div className="relative">
												<Input
													placeholder="3..."
													type="tel"
													className="peer pe-9"
													required
													defaultValue={field.value?.slice(1) ?? ""}
													onChange={({ target: { value: number } }) =>
														field.onChange(field.value?.slice(0, 1) + number)
													}
												/>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															disabled={!field.value}
															type="button"
															size="icon"
															variant="link"
															aria-label="Buscar entidad"
															className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground/80 peer-disabled:opacity-50"
															onClick={() =>
																toast.promise(findEntity(field.value ?? ""), {
																	loading: "Verificando si existe...",
																	success: (data) => {
																		return {
																			message: "Registro encontrado",
																		};
																	},
																	error: (error) => error.message,
																})
															}
														>
															<Search />
														</Button>
													</TooltipTrigger>
													<TooltipContent>Buscar registro</TooltipContent>
												</Tooltip>
											</div>
										</div>
									</FormControl>
									<FormDescription>Prefijo: V o E. Ej: V30...</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)}
				{/* DESCRIPTION FIELD */}
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descripción:</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Aqui puedes añadir información adicional"
									{...field}
									required
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-between items-center">
					<Button
						color="warning"
						type="reset"
						disabled={form.formState.isSubmitting}
						size="lg"
						variant="ghost"
					>
						Limpiar
					</Button>

					<Button size="lg" color="primary" type="submit" form="invoice-form">
						Enviar
					</Button>
				</div>
			</form>
		</Form>
	);
}
