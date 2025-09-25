"use client";

import { Save, Trash2 } from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";
import type { Representative } from "@/utils/interfaces/representative";
import { representativeSchema } from "@/utils/interfaces/schemas";
import { useEffect } from "react";
import { setUpper } from "@/utils/setUpper";
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
import { Button } from "../ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { fetchData } from "@/utils/fetchHandler";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function RepresentativeEditForm({
	data,
}: {
	data: Representative;
}) {
	const form = useForm<Partial<Representative>>({
		defaultValues: {
			user_id: {
				ci_number: "V",
			},
		},
		resolver: yupResolver(representativeSchema.partial()),
	});

	const onSubmit = async (data: Partial<Representative>) =>
		await fetchData<{ message: string }>(
			`/api/representatives/${data.id ?? data.user_id?.ci_number}`,
			{
				body: setUpper<Partial<Representative>>(data),
				method: "PATCH",
			},
		);

	const onDelete = async () => {
		return await fetchData<{ message: string }>(
			`/api/representatives/${data.id}`,
			{
				method: "DELETE",
			},
		);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		form.reset(data);
	}, [data]);

	return (
		<Form {...form}>
			<form
				className="grid grid-cols-2 gap-3 w-full"
				onSubmit={form.handleSubmit((data) =>
					toast.promise(onSubmit(data), {
						loading: "Guardando...",
						success: (data) => data?.message ?? "Datos guardados",
						error: (error) => error.message,
					}),
				)}
				onReset={() => form.reset()}
			>
				<h3 className="col-span-2 font-semibold text-lg">Datos personales:</h3>
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
				{/* <Select
                    items={relationSelect}
                    label="Relación:"
                    selectedKeys={relation ? [relation] : undefined}
                    disabledKeys={Array.from(disKeys)}
                    description={"Ingrese la relación con el estudiante."}
                    onSelectionChange={(value) => setRelation(value.currentKey ?? "")}
                    isRequired
                >
                    {({ value, key }: { value: string; key: string }) => (
                        <SelectItem key={key}>{value}</SelectItem>
                    )}
                </Select> */}

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
				<div className="flex flex-col md:grid grid-cols-3 gap-3 col-span-2">
					{/* OCCUPATION FIELD */}
					<FormField
						control={form.control}
						name="occupation"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ocupación:</FormLabel>
								<FormControl>
									<Input placeholder="Ingrese su ocupación" {...field} />
								</FormControl>
								<FormDescription>¿En qué ocupación trabaja?</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* 
                    <Controller
                        control={form.control}
                        name="occupation"
                        render={({ field, fieldState: { error } }) => (
                            <Input
                                {...field}
                                label="Ocupación:"
                                description="¿En qué ocupación trabaja?"
                                isInvalid={!!error}
                                errorMessage={error?.message}
                            />
                        )}
                    /> */}
					{/* HEIGHT FIELD */}
					<FormField
						control={form.control}
						name="height"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estatura:</FormLabel>
								<FormControl>
									<Input {...field} type="number" min={100} max={300} />
								</FormControl>
								<FormDescription>Ingrese su estatura</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/*
                    <Controller
                        control={form.control}
                        name="height"
                        render={({ field, fieldState: { error } }) => (
                            <NumberInput
                                step={0.01}
                                {...field}
                                label="Estatura:"
                                isInvalid={!!error}
                                errorMessage={error?.message}
                            />
                        )}
                    /> */}
				</div>

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
