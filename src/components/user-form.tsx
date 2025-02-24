"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Search } from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import type { User } from "@/utils/interfaces/user";
import { initValUser, userSchema } from "@/utils/schemas/user";

export default function UserForm({ data }: { data?: User }) {
	const form = useForm<User & { password: string; repeat_password: string }>({
		defaultValues: data ?? initValUser,
		resolver: yupResolver(userSchema),
	});

	return (
		<form
			className="h-2/4 w-3/4 border border-gray-300 rounded-xl shadow-xl p-8"
			onReset={() => form.reset()}
			onSubmit={form.handleSubmit(console.log)}
		>
			<div className="flex items-center justify-center mb-7 w-full">
				<h1 className="text-2xl font-medium">
					Estudiante <p className="text-primary-500 inline-flex">|</p> Registro
				</h1>
			</div>
			<div className="grid grid-cols-8 gap-3">
				{/* CI FIELD */}
				<Input
					{...form.register("ci_number")}
					isRequired={!data}
					label="Cédula de identidad:"
					description="Ingrese su Cédula de identidad"
					variant="bordered"
					errorMessage={form.formState.errors.ci_number?.message}
					className="col-span-2"
				/>

				{/* SEARCH BUTTON */}
				{!data && (
					<Tooltip
						content="Buscar Estudiante"
						className="border border-primary-500"
					>
						<Button
							isDisabled={!form.watch("ci_number")}
							isIconOnly
							color="primary"
							variant="ghost"
							aria-label="Buscar entidad"
							className="w-3/4 h-3/4"
							onPress={
								() => {}
								/* toast.promise(searchStudent(values.person_id?.ci_number), {
									loading: "Procesando...",
									success: (data) => {
										router.push(`/search/student/${data?.ci_number}`);
										return "Búsqueda exitosa.";
									},
									error: (error: Error) => {
										if (error.message === "Failed to fetch") {
											return "Error en conexión.";
										}
										return error.message;
									},
								}) */
							}
						>
							<Search className="text-2xl" />
						</Button>
					</Tooltip>
				)}

				<span className="col-span-2">&nbsp;</span>

				{/* NAME FIELD */}
				<Input
					{...form.register("name")}
					isRequired={!data}
					label="Nombres:"
					description="Ingrese sus Nombres"
					variant="bordered"
					errorMessage={form.formState.errors.name?.message}
					className="col-span-4"
				/>

				{/* LASTNAME FIELD */}
				<Input
					{...form.register("lastname")}
					isRequired={!data}
					label="Apellidos:"
					description="Ingrese sus Apellidos"
					variant="bordered"
					errorMessage={form.formState.errors.lastname?.message}
					className="col-span-4"
				/>

				{/* EMAIL FIELD */}
				<Input
					{...form.register("email")}
					label="Correo electrónico:"
					type="email"
					description="Ingrese su correo electrónico"
					variant="bordered"
					errorMessage={form.formState.errors.email?.message}
					className="col-span-3"
				/>

				{/* PHONE_NUMBER FIELD */}
				<Input
					{...form.register("phone_number")}
					label="Número telefónico:"
					description="Ingrese su número de teléfono"
					variant="bordered"
					errorMessage={form.formState.errors.phone_number?.message}
					className="col-span-3"
				/>

				<Input
					{...form.register("password")}
					label="Contraseña:"
					description="Ingrese su contraseña"
					variant="bordered"
					errorMessage={form.formState.errors.password?.message}
					className="col-span-3"
				/>

				<Input
					{...form.register("repeat_password")}
					label="Repita contraseña:"
					variant="bordered"
					errorMessage={form.formState.errors.repeat_password?.message}
					className="col-span-3"
				/>
			</div>
		</form>
	);
}
