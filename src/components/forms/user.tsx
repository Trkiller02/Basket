"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Check, Search, X } from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import type { User } from "@/utils/interfaces/user";
import { userSchema } from "@/utils/interfaces/schemas";
import { addToast } from "@heroui/toast";
import { getEntityData } from "@/lib/action-data";
import { useState } from "react";
import { MsgError } from "@/utils/messages";

export default function UserForm({ data }: { data?: User }) {
	const [isAvailable, setIsAvailable] = useState<boolean | undefined>();

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

	const onSubmit = async (data: User) => {};

	return (
		<form
			className="h-2/4 w-3/4 border border-gray-300 rounded-xl shadow-xl p-8"
			onReset={() => form.reset()}
			onSubmit={form.handleSubmit(console.log)}
		>
			<div className="flex items-center justify-center mb-7 w-full">
				<h1 className="text-2xl font-medium">
					Usuario <p className="text-primary-500 inline-flex">|</p> Registro
				</h1>
			</div>
			<div className="grid grid-cols-8 gap-3">
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
												addToast({
													title: "Verificando si existe...",
													description: "Será breve.",
													promise: findEntity(field.value),
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

				<span className="col-span-2">&nbsp;</span>

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
