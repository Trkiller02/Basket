"use client";

import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Search } from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import type { Representative } from "@/utils/interfaces/representative";
import {
	initValRepresentative,
	representativeSchema,
} from "@/utils/schemas/representative";
import { useEffect } from "react";

export default function RepresentativeForm({
	data,
}: { data?: Representative }) {
	const form = useForm<Representative>({
		mode: "all",
		criteriaMode: "all",
		reValidateMode: "onChange",
		defaultValues: data ?? initValRepresentative,
		resolver: yupResolver(representativeSchema),
	});

	useEffect(
		() => console.log({ errors: form.formState.errors }),
		[form.formState.errors],
	);

	const onSubmit = (data: Representative) => {
		console.log(data);
	};

	return (
		<form
			className="grid grid-cols-2 gap-3 w-full"
			onSubmit={form.handleSubmit(console.log)}
			onReset={() => form.reset()}
			id="representante-form"
		>
			{/* CI FIELD */}
			<Controller
				control={form.control}
				name="user_id.ci_number"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						isRequired={!data}
						color={error ? "danger" : "default"}
						label="Cédula de identidad:"
						description="Ingrese su Cédula de identidad"
						isInvalid={!!error}
						errorMessage={error?.message}
						endContent={
							!data && (
								<Tooltip content="Buscar representante">
									<Button
										isDisabled={!form.watch("user_id.ci_number")}
										isIconOnly
										variant="light"
										aria-label="Buscar entidad"
										className="text-foreground-700"
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
										<Search className="px-1" />
									</Button>
								</Tooltip>
							)
						}
					/>
				)}
			/>
			&nbsp;
			{/* NAME FIELD */}
			<Controller
				name="user_id.name"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						isRequired={!data}
						label="Nombres:"
						description="Ingrese sus Nombres"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			{/* LASTNAME FIELD */}
			<Controller
				name="user_id.lastname"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						isRequired={!data}
						label="Apellidos:"
						description="Ingrese sus Apellidos"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			{/* EMAIL FIELD */}
			<Controller
				name="user_id.email"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						label="Correo electrónico:"
						type="email"
						description="Ingrese su correo electrónico"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			{/* PHONE_NUMBER FIELD */}
			<Controller
				name="user_id.phone_number"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						name="user_id.phone_number"
						color={error ? "danger" : "default"}
						label="Número telefónico:"
						description="Ingrese su número de teléfono"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			{/* OCCUPATION FIELD */}
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
			/>
			{/* HEIGHT FIELD */}
			<Controller
				control={form.control}
				name="height"
				render={({ field, fieldState: { error } }) => (
					<NumberInput
						{...field}
						onChange={(value) => form.setValue("height", value as number)}
						label="Estatura:"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			<button type="submit">Enviar</button>
		</form>
	);
}
