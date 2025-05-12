"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Check, Eye, EyeOff, Search, X } from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import type { User } from "@/utils/interfaces/user";
import { userSchema } from "@/utils/interfaces/schemas";
import { getEntityData } from "@/lib/action-data";
import { useEffect, useState } from "react";
import { MsgError } from "@/utils/messages";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { setUpper } from "@/utils/setUpper";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import ModalSecurity from "./modal-security";

export default function UserForm() {
	const [isAvailable, setIsAvailable] = useState<boolean | undefined>();
	const [isVisible, setIsVisible] = useState(false);
	const [data, setData] = useState<{
		password: string;
		restore_code: string;
		name: string;
	}>();
	const [isOpen, setIsOpen] = useState(false);

	const findEntity = async (id: string) => {
		try {
			const response = await getEntityData("users", id.toUpperCase(), true);
			if (response) setIsAvailable(false);
		} catch (error) {
			if ((error as Error).message === MsgError.NOT_FOUND) {
				setIsAvailable(true);

				throw {
					message: "Registro no encontrado",
					description: "Puede continuar con el registro.",
				};
			}

			throw {
				message: "Error al buscar registro",
				description: (error as Error).message,
			};
		}
	};

	const form = useForm<
		Omit<User, "password" | "repeat_password" | "restore_code" | "id"> & {
			password: string;
			repeat_password: string;
		}
	>({
		criteriaMode: "firstError",
		mode: "all",
		resolver: yupResolver(userSchema),
	});

	const onSubmit = async (
		data: Omit<User, "password" | "repeat_password" | "restore_code" | "id"> & {
			password: string;
			repeat_password: string;
		},
	) => {
		const key = crypto.randomUUID().slice(0, 6);

		const { data: info, error } = await authClient.admin.createUser({
			...setUpper({
				email: data.email,
				password: data.password ?? "",
				name: data.name,
				role: data.role ?? "user",
				data: {
					lastname: data.lastname,
					phone_number: data.phone_number,
					ci_number: data.ci_number,
					restore_code: await bcrypt.hash(key, 10),
				},
			}),
		});

		if (error) throw error;

		if (info) {
			setData({ name: data.name, password: data.password, restore_code: key });
			setIsOpen(true);
			return "Registro exitoso";
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const temporizador = setTimeout(() => {
			setIsAvailable(undefined);
		}, 3000); // 3000 milisegundos = 3 segundos

		// Limpia el temporizador si el componente se desmonta o el estado cambia antes de que expire el temporizador
		return () => clearTimeout(temporizador);
	}, [isAvailable]);

	return (
		<Card className="w-1/3 p-2 border-2 border-primary">
			<CardHeader>
				<h1 className="text-2xl font-medium text-center">
					Registro
					<p className="text-primary inline-flex">|</p> Usuario
				</h1>
			</CardHeader>
			<CardBody>
				<form
					id="register-form"
					className="grid grid-cols-2 p-2 gap-2"
					onReset={() => form.reset()}
					onSubmit={form.handleSubmit((values) =>
						toast.promise(onSubmit(values), {
							loading: "Registrando...",
							description: "Por favor espere.",
							success: (data) => {
								return data;
							},
							error: (error) => error.message,
						}),
					)}
				>
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
																description: "No puede volver a resgtrarse",
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
					&nbsp;
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
					<ModalSecurity
						isOpenProp={isOpen}
						setIsOpenAction={setIsOpen}
						data={data}
					/>
				</form>
			</CardBody>
			<CardFooter>
				<Button
					type="submit"
					className="col-span-2"
					fullWidth
					color="primary"
					isLoading={form.formState.isSubmitting}
					form="register-form"
				>
					{form.formState.isSubmitting ? "Enviando..." : "Registrarse"}
				</Button>
			</CardFooter>
		</Card>
	);
}
