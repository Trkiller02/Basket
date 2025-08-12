"use client";

import type React from "react";

import {
	Upload,
	FileText,
	Check,
	History,
	Search,
	HandCoins,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Athlete } from "@/utils/interfaces/athlete";
import type { CreateInvoices } from "@/utils/interfaces/invoice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { invoiceSchema } from "@/utils/interfaces/schemas";
import { useSearchParams } from "next/navigation";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { getInvoiceStatus, getInvoiceStatusColor } from "@/utils/invoiceHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { findEntity } from "@/utils/getEntity";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function InvoicesFormForm({
	athleteList,
	pricing,
	representId,
}: {
	athleteList?: Pick<Athlete, "user_id" | "solvent" | "id">[];
	pricing: number;
	representId?: string;
}) {
	const athleteId = useSearchParams().get("q") ?? undefined;
	const [reprId, setReprId] = useState<string | undefined>(undefined);

	const form = useForm<CreateInvoices>({
		resolver: yupResolver(invoiceSchema),
		defaultValues: {
			athlete_id: athleteId,
			representative_id: representId ?? "V",
		},
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const { data: athletesFind } = useSWR<{
		result: Pick<Athlete, "user_id" | "solvent">[];
	}>(reprId ? `/api/repr-athletes/${reprId}?invoice=true` : null, fetcher);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		console.log({ represent: form.watch("representative_id"), athletesFind });
	}, [form.watch("representative_id"), athletesFind]);

	const handleToggle = (userId: string) => {
		const prev = new Set(form.watch("athlete_id")?.split(",").filter(Boolean));

		console.log({ prev, userId });

		if (prev.has(userId)) prev.delete(userId);
		else prev.add(userId);

		return Array.from(prev).join(",");
	};

	const handleSubmit = async (e: CreateInvoices) => {
		const { image_path, ...props } = e;

		alert(JSON.stringify(props));
	};

	const athletesWatched =
		form.watch("athlete_id")?.split(",").filter(Boolean) ?? [];
	const athletesLength = athletesWatched.length;
	const montoTotal = athletesLength * pricing;

	return (
		<section className="min-h-screen p-4">
			<div className="mb-6 flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Pago de Mensualidad
					</h1>
					<p className="text-gray-600">
						Registra el pago de mensualidad para tus estudiantes
					</p>
				</div>

				{/* Botón para ver historial de pagos */}

				<Button variant="outline" className="flex items-center gap-2" asChild>
					<Link href="/pagos/historial">
						<History className="h-4 w-4" />
						Historial de Pagos
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						<HandCoins className="h-6 w-6" />
						Información del Pago
					</CardTitle>
					<CardDescription>
						Completa los datos del pago de mensualidad
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							id="invoice-form"
							className="space-y-6"
						>
							{/* Representante */}
							{!representId && (
								<FormField
									control={form.control}
									name="representative_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cédula de identidad:</FormLabel>
											<FormControl>
												<div className="flex items-center gap-2 w-full">
													<Select
														onValueChange={(value) =>
															field.onChange(
																value + (field.value?.slice(1) ?? ""),
															)
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
																field.onChange(
																	field.value?.slice(0, 1) + number,
																)
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
																		toast.promise(
																			findEntity(field.value ?? ""),
																			{
																				loading: "Verificando si existe...",
																				success: (data) => {
																					setReprId(data?.id);
																					return {
																						message: "Registro encontrado",
																					};
																				},
																				error: (error) => error.message,
																			},
																		)
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
											<FormDescription>
												Prefijo: V o E. Ej: V30...
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{/* Selección de Estudiantes - FindByRepresentative */}
							{athletesFind && (
								<FormField
									control={form.control}
									name="athlete_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Estudiantes</FormLabel>
											<FormControl>
												<div className="space-y-3 md:grid md:grid-cols-2 md:gap-2">
													{athletesFind?.result?.map((estudiante) => (
														<div
															key={estudiante.user_id.ci_number}
															className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
														>
															<Checkbox
																id={estudiante.user_id.ci_number}
																defaultChecked={athletesWatched.includes(
																	estudiante.user_id.ci_number,
																)}
																onCheckedChange={(checked) =>
																	field.onChange(
																		handleToggle(estudiante.user_id.ci_number),
																	)
																}
																disabled={estudiante.solvent !== 0}
																className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
															/>
															<label
																htmlFor={estudiante.user_id.ci_number}
																className="flex-1 flex items-center gap-2 cursor-pointer peer-disabled:opacity-50 peer-disabled:cursor-not-allowed transition-opacity"
															>
																<Avatar className="h-10 w-10 border-2 border-border">
																	<AvatarImage
																		src={estudiante.user_id.image}
																		alt={estudiante.user_id.name}
																	/>
																	<AvatarFallback className="text-xs">
																		{estudiante.user_id.name
																			.split(" ")
																			.map((n) => n[0])
																			.join("")}
																	</AvatarFallback>
																</Avatar>

																<div className="flex-1 min-w-0">
																	<div className="flex items-center space-x-2">
																		<p className="text-sm font-medium truncate">
																			{estudiante.user_id.name}
																		</p>
																		<Tooltip>
																			<TooltipTrigger asChild>
																				<div
																					className={`w-4 h-4 rounded-full border-2 border-border ${getInvoiceStatusColor(
																						estudiante.solvent,
																						"bg",
																					)}`}
																				/>
																			</TooltipTrigger>
																			<TooltipContent>
																				{getInvoiceStatus(estudiante.solvent)}
																			</TooltipContent>
																		</Tooltip>
																	</div>
																	<p className="text-xs text-muted-foreground truncate">
																		{estudiante.user_id.lastname}
																	</p>
																</div>
																{/* <User className="h-4 w-4" />
																<div>
																	<div className="font-medium">
																		{estudiante.user_id.name}
																	</div>
																	<div className="text-sm text-gray-500">
																		{estudiante.user_id.lastname}
																	</div>
																</div> */}
															</label>
														</div>
													))}
												</div>
											</FormControl>
											<FormDescription>
												Selecciona los estudiantes para los cuales deseas
												registrar el pago
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{/* Selección de Estudiantes */}
							{athleteList && (
								<FormField
									control={form.control}
									name="athlete_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Estudiantes</FormLabel>
											<FormControl>
												<div className="space-y-3 md:grid md:grid-cols-2 md:gap-2">
													{athleteList?.map((estudiante) => (
														<div
															key={estudiante.user_id.ci_number}
															className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
														>
															<Checkbox
																id={estudiante.id}
																defaultChecked={athletesWatched.includes(
																	estudiante.user_id.ci_number,
																)}
																onCheckedChange={(checked) =>
																	field.onChange(
																		handleToggle(estudiante.user_id.ci_number),
																	)
																}
																disabled={estudiante.solvent !== 0}
																className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
															/>
															<label
																htmlFor={estudiante.id}
																className="flex-1 flex items-center gap-2 cursor-pointer peer-disabled:opacity-50 peer-disabled:cursor-not-allowed transition-opacity"
															>
																<Avatar className="h-10 w-10 border-2 border-border">
																	<AvatarImage
																		src={estudiante.user_id.image}
																		alt={estudiante.user_id.name}
																	/>
																	<AvatarFallback className="text-xs">
																		{estudiante.user_id.name
																			.split(" ")
																			.map((n) => n[0])
																			.join("")}
																	</AvatarFallback>
																</Avatar>

																<div className="flex-1 min-w-0">
																	<div className="flex items-center space-x-2">
																		<p className="text-sm font-medium truncate">
																			{estudiante.user_id.name}
																		</p>
																		<Tooltip>
																			<TooltipTrigger asChild>
																				<div
																					className={cn(
																						"w-4 h-4 rounded-full border-2 border-border",
																						getInvoiceStatusColor(
																							estudiante.solvent,
																							"bg",
																						),
																					)}
																				/>
																			</TooltipTrigger>
																			<TooltipContent>
																				{getInvoiceStatus(estudiante.solvent)}
																			</TooltipContent>
																		</Tooltip>
																	</div>
																	<p className="text-xs text-muted-foreground truncate">
																		{estudiante.user_id.lastname}
																	</p>
																</div>
																{/* <User className="h-4 w-4" />
																<div>
																	<div className="font-medium">
																		{estudiante.user_id.name}
																	</div>
																	<div className="text-sm text-gray-500">
																		{estudiante.user_id.lastname}
																	</div>
																</div> */}
															</label>
														</div>
													))}
												</div>
											</FormControl>
											<FormDescription>
												Selecciona los estudiantes para los cuales deseas
												registrar el pago
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{/* Concepto */}
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Concepto</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												onChange={(e) => field.onChange(e.target.value)}
												placeholder="Describe el concepto del pago"
												className="min-h-[80px]"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Comprobante de Pago */}
							<FormField
								control={form.control}
								name="image_path"
								render={({ field: { value, ...field } }) => (
									<FormItem>
										<FormLabel>Comprobante de Pago</FormLabel>
										<FormControl>
											<div className="border-2 border-dashed border-gray-300 rounded-lg  text-center hover:border-gray-400 transition-colors overflow-hidden">
												<input
													{...field}
													type="file"
													accept="image/*,.pdf"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) {
															const lector = new FileReader();
															lector.onload = (evento) => {
																if (evento.target?.result)
																	field.onChange(
																		evento.target.result.toString(),
																	);
															};

															lector.readAsDataURL(file);
														}
													}}
													className="hidden"
													id="comprobante-upload"
												/>
												<label
													htmlFor="comprobante-upload"
													className="cursor-pointer relative min-h-[140px] flex flex-col justify-center items-center"
												>
													{value ? (
														value.split(";")[0].endsWith("pdf") ? (
															<span className="flex items-center justify-center gap-2 text-green-600">
																<Check className="h-4 w-4" />
																Archivo subido
															</span>
														) : (
															<Image
																src={value}
																alt="Uploaded image"
																fill
																className="object-cover"
															/>
														)
													) : (
														<>
															<Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
															<p className="text-sm text-gray-600 relative">
																Haz clic para subir tu comprobante de pago
																<br />
																<span className="text-xs text-gray-400">
																	PNG, JPG, PDF hasta 10MB
																</span>
															</p>
														</>
													)}
												</label>
											</div>
										</FormControl>
										<FormDescription>
											Sube una imagen o PDF del comprobante de pago
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Resumen */}
							<Card>
								<CardHeader className="pb-0 mb-0">
									<CardTitle className="text-xl flex items-center gap-2">
										<FileText className="h-6 w-6" />
										Resumen del Pago
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex justify-between">
										<span className="font-semibold">Estudiantes:</span>
										<span className="font-bold">
											{athletesLength > 0
												? `${athletesLength} seleccionado${athletesLength > 1 ? "s" : ""}`
												: "Ninguno seleccionado"}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-semibold">Monto por estudiante:</span>
										<span className="font-medium text-green-900">
											{pricing.toFixed(2)} Bs.
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-semibold">Monto Total:</span>
										<span className="font-bold text-green-900">
											{montoTotal.toFixed(2)} Bs.
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-semibold">Comprobante:</span>
										<span className="text-green-900 font-bold">
											{form.watch("image_path") ? "Adjuntado" : "Pendiente"}
										</span>
									</div>
								</CardContent>
							</Card>
						</form>
					</Form>
				</CardContent>

				<CardFooter className="flex justify-between">
					<Button type="button" variant="destructive">
						Cancelar
					</Button>
					<Button
						type="submit"
						form="invoice-form"
						disabled={
							athletesLength === 0 ||
							!form.watch("image_path") ||
							form.formState.isSubmitting
						}
					>
						{form.formState.isSubmitting ? "Procesando..." : "Registrar Pago"}
					</Button>
				</CardFooter>
			</Card>
		</section>
	);
}
