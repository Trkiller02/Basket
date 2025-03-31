"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Check, Eye, EyeOff, Search, X } from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import type { User } from "@/utils/interfaces/user";
import { userSchema } from "@/utils/interfaces/schemas";
import { addToast } from "@heroui/toast";
import { getEntityData } from "@/lib/action-data";
import { useState } from "react";
import { MsgError } from "@/utils/messages";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";

export default function UserForm({ data }: { data?: User }) {
	const [isAvailable, setIsAvailable] = useState<boolean | undefined>();
	const [isVisible, setIsVisible] = useState(false);

	const findEntity = async (id: string) => {
		try {
			const response = await getEntityData("users", id);
			if (response) setIsAvailable(false);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === MsgError.NOT_FOUND) return setIsAvailable(true);

				addToast({
					title: "Error al buscar registro",
					description: error.message,
					color: "danger",
				});
			}
		}
	};

	const form = useForm<User & { password: string; repeat_password: string }>({
		criteriaMode: "firstError",
		mode: "all",
		defaultValues: data,
		resolver: yupResolver(userSchema),
	});

	const onSubmit = async (data: User) => {
		const { data: info, error } = await authClient.signUp.email({
			email: data.email,
			password: data.password ?? "",
			name: data.name,
			lastname: data.lastname,
			phone_number: data.phone_number,
			ci_number: data.ci_number,
		});
		console.log({ data, error });

		if (error) return toast.error(error.message);
	};

	return (
		<form
			className="flex flex-col h-2/4 w-1/2 p-6 gap-2"
			onReset={() => form.reset()}
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<h1 className="text-2xl font-medium my-2">
				Usuario <p className="text-primary inline-flex">|</p> Registro
			</h1>
			{/* CI FIELD */}
			<Controller
				control={form.control}
				name="ci_number"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						isRequired
						color={error ? "danger" : "default"}
						label="Cédula de identidad:"
						description="V30... ó E23..."
						isInvalid={!!error}
						errorMessage={error?.message}
						endContent={
							typeof isAvailable !== "boolean" ? (
								<Tooltip content="Buscar registro" color="primary">
									<Button
										isDisabled={!field.value}
										isIconOnly
										variant="light"
										aria-label="Buscar entidad"
										className="text-foreground-700"
										onPress={() =>
											toast.promise(findEntity(field.value), {
												loading: "Verificando si existe...",
												description: "Será breve.",
												success: (data) => {
													return {
														message: "Registro encontrado",
														description: "No, puede registrar un nuevo ",
													};
												},
												error: (error) => error,
											})
										}
									>
										<Search className="px-1" />
									</Button>
								</Tooltip>
							) : (
								<Tooltip
									content={isAvailable ? "Disponible" : "Registrado"}
									color="default"
								>
									<div
										className={`w-6 h-6 flex justify-center items-center rounded-full ${isAvailable ? "bg-success" : "bg-danger"}`}
									>
										{isAvailable ? (
											<Check className="text-white py-2" />
										) : (
											<X className="text-white py-2" />
										)}
									</div>
								</Tooltip>
							)
						}
					/>
				)}
			/>
			{/* NAME FIELD */}
			<Controller
				name="name"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						isRequired
						label="Nombres:"
						description="Ingrese sus Nombres"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			{/* LASTNAME FIELD */}
			<Controller
				name="lastname"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						isRequired
						label="Apellidos:"
						description="Ingrese sus Apellidos"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			{/* EMAIL FIELD */}
			<Controller
				name="email"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						label="Correo electrónico:"
						type="email"
						description="Ej: pedro123@gmail.com"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			{/* PHONE_NUMBER FIELD */}
			<Controller
				name="phone_number"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						label="Número telefónico:"
						description="Ej: 0424..."
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			<Controller
				name="password"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						type={isVisible ? "text" : "password"}
						label="Contraseña:"
						description="Ingrese su contraseña"
						variant="bordered"
						errorMessage={error?.message}
						isInvalid={!!error}
						className="col-span-2"
						endContent={
							<Button
								onPress={() => setIsVisible(!isVisible)}
								color="default"
								variant="light"
								className="text-default-500"
								isIconOnly
							>
								{isVisible ? <EyeOff /> : <Eye />}
							</Button>
						}
					/>
				)}
			/>
			<Controller
				name="repeat_password"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						type={isVisible ? "text" : "password"}
						label="Repita contraseña:"
						variant="bordered"
						isInvalid={!!error}
						errorMessage={error?.message}
						className="col-span-2"
						endContent={
							<Button
								onPress={() => setIsVisible(!isVisible)}
								color="default"
								variant="light"
								className="text-default-500"
								isIconOnly
							>
								{isVisible ? <EyeOff /> : <Eye />}
							</Button>
						}
					/>
				)}
			/>

			<Link href="/sesion/iniciar" className="text-end">
				¿Desea iniciar sesión?
			</Link>

			<Button type="submit" className="col-span-2" fullWidth color="primary">
				{form.formState.isSubmitting ? "Enviando..." : "Registrarse"}
			</Button>
		</form>
	);
}
