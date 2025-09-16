"use client";

import { Save, Trash2, Upload } from "lucide-react";

import { dateHandler } from "@/utils/dateHandler";

import type { Athlete } from "@/utils/interfaces/athlete";
import { athleteSchema } from "@/utils/interfaces/schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, memo } from "react";
import Image from "next/image";
import { setUpper } from "@/utils/setUpper";
import { categories } from "@/utils/getCategories";
import { toast } from "sonner";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import Link from "next/link";
import { fetchData } from "@/utils/fetchHandler";

function AthleteEditForm({ data }: { data: Athlete }) {
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
				form.setValue("user_id.image", evento.target?.result?.toString());
			};

			lector.readAsDataURL(file);
		}
	};

	const form = useForm<Partial<Omit<Athlete, "id">>>({
		defaultValues: {
			user_id: {
				ci_number: "V",
			},
		},
		mode: "all",
		criteriaMode: "firstError",
		resolver: yupResolver(athleteSchema.partial()),
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

	const onSubmit = async (data: Partial<Athlete>) =>
		await fetchData<{ message: string }>(`/api/athletes/${data.id}`, {
			body: setUpper<Partial<Athlete>>(data),
			method: "PATCH",
		});

	const onDelete = async () => {
		return await fetchData<{ message: string }>(`/api/athletes/${data.id}`, {
			method: "DELETE",
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		form.reset(data);
	}, [data]);

	return (
		<Form {...form}>
			<form
				className="flex flex-col md:grid grid-cols-2 gap-3 w-full"
				onSubmit={form.handleSubmit((values) =>
					toast.promise(onSubmit(values), {
						loading: "Guardando...",
						success: (data) => data?.message ?? "Datos guardados",
						error: (error) => error.message,
					}),
				)}
				onReset={() => form.reset()}
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

									<Input
										placeholder="3..."
										type="tel"
										className="peer pe-9"
										defaultValue={field.value?.slice(1) ?? ""}
										onChange={({ target: { value: number } }) =>
											field.onChange(field.value?.slice(0, 1) + number)
										}
									/>
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
								<Input placeholder="Ingrese sus Nombres" {...field} />
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
								<Input placeholder="Ingrese sus Apellidos" {...field} />
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
								<Input placeholder="Ingrese su dirección" {...field} />
							</FormControl>
							<FormDescription>
								Ej: Calle 123 Piso 1 Ciudad Estado...
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<h3 className="col-span-2 font-semibold text-lg">
					Datos de Nacimiento:
				</h3>
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
								/>
							</FormControl>
							<FormDescription>Ej: Madrid...</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<h3 className="col-span-2 font-semibold text-lg">
					Datos de Atleticos:
				</h3>
				{/* CATEGORY FIELD */}
				<FormField
					control={form.control}
					name={"category"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Categoría:</FormLabel>
							<Select
								onValueChange={(value) => field.onChange(value)}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="V" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem value={category} key={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								La categoria se asigna mediante la edad.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* POSITION FIELD */}
				<FormField
					control={form.control}
					name={"position"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Posición:</FormLabel>
							<FormControl>
								<Input placeholder="Ingrese la posición" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="col-span-2 inline-flex items-center gap-4 justify-end">
					<Button variant="outline" asChild>
						<Link href="/">Cancelar</Link>
					</Button>

					<Button
						type="button"
						variant="destructive"
						className="flex items-center space-x-2"
						onClick={() =>
							toast.promise(onDelete, {
								loading: "Eliminando...",
								success: (data) => data?.message ?? "Datos eliminados",
								error: (err: Error) =>
									`Error al eliminar datos: ${err.message}`,
							})
						}
					>
						<Trash2 className="h-4 w-4" />
						<span>Eliminar</span>
					</Button>

					<Button type="submit" className="flex items-center space-x-2">
						<Save className="h-4 w-4" />
						<span>Guardar</span>
					</Button>
				</div>
			</form>
		</Form>
	);
}

export default memo(AthleteEditForm);
