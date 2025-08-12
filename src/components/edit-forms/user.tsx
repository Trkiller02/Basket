"use client";

import { Save } from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "@/utils/interfaces/schemas";
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
import type { User } from "@/utils/interfaces/user";

export default function UserEditForm({ data }: { data: User }) {
	const form = useForm<Partial<User>>({
		defaultValues: {
			ci_number: "V",
		},
		resolver: yupResolver(userSchema.partial()),
	});

	const onSubmit = async (data: Partial<User>) =>
		await fetchData<{ message: string }>(`/api/users/${data.id}`, {
			body: setUpper<Partial<User>>(data),
			method: "PATCH",
		});

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
					name="ci_number"
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
					name={"name"}
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
					name={"lastname"}
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
					name={"email"}
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
					name={"phone_number"}
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

				<div className="col-span-2 inline-flex items-center gap-4">
					<Button variant="outline" asChild>
						<Link href="/">Cancelar</Link>
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
