"use client";

import { Search, Upload } from "lucide-react";

import { dateHandler } from "@/utils/dateHandler";

import type { Athlete } from "@/utils/interfaces/athlete";
import { athleteSchema } from "@/utils/interfaces/schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useGetStep } from "@/utils/getStep";
import { useEffect, useRef, memo } from "react";
import Image from "next/image";
import { setUpper } from "@/utils/setUpper";
import { getCategories } from "@/utils/getCategories";
import { toast } from "sonner";
import { findEntity } from "@/utils/getEntity";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

function AthleteForm() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const registerData = useRegisterStore((state) => state.registerData);
	const setRegisterData = useRegisterStore((state) => state.setRegisterData);
	const getStep = useGetStep("atleta", { data: registerData });

	const handleIconClick = () => {
		// Trigger the hidden file input when the icon is clicked
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			const lector = new FileReader();
			lector.onload = (evento) => {
				form.setValue("user_id.image", evento.target?.result?.toString());
			};

			lector.readAsDataURL(file);
		}
	};

	const form = useForm<Omit<Athlete, "id">>({
		defaultValues: {
			user_id: {
				ci_number: "V",
			},
		},
		mode: "all",
		criteriaMode: "firstError",
		resolver: yupResolver(athleteSchema),
	});

	const today = new Date();

	// Fecha mínima: hace 20 años
	const minDate = new Date(
		today.getFullYear() - 20,
		today.getMonth(),
		today.getDate(),
	);

	// Fecha máxima: hace 5 años
	const maxDate = new Date(
		today.getFullYear() - 5,
		today.getMonth(),
		today.getDate(),
	);

	// Formatear fechas para el input (YYYY-MM-DD)
	const formatDate = (date: Date) => {
		return date.toISOString().split("T")[0];
	};

	const onSubmit = (data: Athlete) => {
		setRegisterData({
			athlete: setUpper<Athlete>({
				...data,
				category: getCategories(data.age),
			}),
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (registerData.athlete) {
			if (form.formState.isSubmitting)
				return router.replace(`/registrar?etapa=${getStep()}`);

			form.reset(registerData.athlete);
		}
	}, [registerData]);

	return (
		<Form {...form}>
			<form
				className="flex flex-col md:grid grid-cols-2 gap-3 w-full"
				onSubmit={form.handleSubmit(onSubmit)}
				onReset={() => form.reset()}
				id="atleta-form"
			>
				<h1 className="col-span-2 font-semibold text-lg">Datos personales:</h1>

				{/* CI FIELD */}
				<FormField
					control={form.control}
					name="user_id.ci_number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cédula de identidad:</FormLabel>
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
														toast.promise(
															findEntity(field.value, registerData),
															{
																loading: "Verificando si existe...",
																success: (data) => {
																	return {
																		message: "Registro encontrado",
																		description: "¿Desea editarlo?",
																		action: {
																			label: "Editar",
																			onClick: () =>
																				router.replace(
																					`/editar/atleta/${field.value}`,
																				),
																		},
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
							<FormDescription>Prefijo: V o E. Ej: V30...</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="inline-flex items-center gap-4">
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
					<div
						className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary bg-gray-50 hover:bg-gray-100"
						onClick={handleIconClick}
					>
						{form.watch("user_id.image") ? (
							// Show the uploaded image
							<Image
								src={form.watch("user_id.image") ?? ""}
								alt="Uploaded image"
								fill
								className="object-cover"
							/>
						) : (
							// Show the upload icon
							<Upload className="h-12 w-12 text-gray-400 py-2" />
						)}
						<input
							{...form.register("user_id.image")}
							ref={fileInputRef}
							type="file"
							onChange={handleFileChange}
							hidden
							accept="image/*"
						/>
					</div>

					<div className="flex flex-col">
						<h6>Fotografia del atleta</h6>
						<p className="text-sm text-gray-500">
							La fotografía debe ser tipo carnet.
						</p>
					</div>
				</div>
				{/* NAME FIELD */}
				<FormField
					control={form.control}
					name={"user_id.name"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombres:</FormLabel>
							<FormControl>
								<Input placeholder="Ingrese sus Nombres" {...field} required />
							</FormControl>
							<FormDescription>Ej: Maria Jose</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* LASTNAME FIELD */}
				<FormField
					control={form.control}
					name={"user_id.lastname"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Apellidos:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ingrese sus Apellidos"
									{...field}
									required
								/>
							</FormControl>
							<FormDescription>Ej: Perez Marquez</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* EMAIL FIELD */}
				<FormField
					control={form.control}
					name={"user_id.email"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Correo electrónico:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ej: pedro123@gmail.com"
									{...field}
									required
									type="email"
								/>
							</FormControl>
							<FormDescription>Ej: pedro123@gmail.com</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* PHONE_NUMBER FIELD */}
				<FormField
					control={form.control}
					name={"user_id.phone_number"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Número telefónico:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ingrese su numero telefonico"
									{...field}
									type="tel"
								/>
							</FormControl>
							<FormDescription>Ej: 0424...</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* ADDRESS FIELD */}
				<FormField
					control={form.control}
					name={"address"}
					render={({ field }) => (
						<FormItem className="col-span-2">
							<FormLabel>Dirección:</FormLabel>
							<FormControl>
								<Input placeholder="Ingrese su dirección" {...field} required />
							</FormControl>
							<FormDescription>
								Ej: Calle 123 Piso 1 Ciudad Estado...
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<h1 className="col-span-2 font-semibold text-lg">
					Datos de Nacimiento:
				</h1>
				{/* BIRTH_DATE FIELD */}
				<FormField
					control={form.control}
					name={"birth_date"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Fecha de nacimiento:</FormLabel>
							<FormControl>
								<Input
									{...field}
									onChange={({ target: { value: date } }) => {
										field.onChange(date);
										form.setValue("age", dateHandler(date));
									}}
									required
									min={formatDate(minDate)}
									max={formatDate(maxDate)}
									type="date"
								/>
							</FormControl>
							<FormDescription>Ingrese la fecha de nacimiento</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* AGE FIELD */}
				<FormField
					control={form.control}
					name={"age"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Edad:</FormLabel>
							<FormControl>
								<Input {...field} readOnly type="number" />
							</FormControl>
							<FormDescription>Ingrese la fecha de nacimiento</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* BIRTH_PLACE FIELD */}
				<FormField
					control={form.control}
					name={"birth_place"}
					render={({ field }) => (
						<FormItem className="col-span-2">
							<FormLabel>Lugar de nacimiento:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ingrese su lugar de nacimiento"
									{...field}
									required
								/>
							</FormControl>
							<FormDescription>Ej: Madrid...</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}

export default memo(AthleteForm);
