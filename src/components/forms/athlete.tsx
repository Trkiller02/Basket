"use client";

import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Search } from "lucide-react";
import { DatePicker } from "@heroui/date-picker";

import { dateHandler } from "@/utils/dateHandler";

import type { Athlete } from "@/utils/interfaces/athlete";
import { athleteSchema, initValAthlete } from "@/utils/schemas/athlete";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function AthleteForm({ data }: { data?: Athlete }) {
	const form = useForm<Athlete>({
		criteriaMode: "firstError",
		mode: "all",
		defaultValues: data ?? initValAthlete,
		resolver: yupResolver(athleteSchema),
		shouldUseNativeValidation: true,
	});

	return (
		<form
			className="grid grid-cols-2 gap-3 w-full"
			onSubmit={form.handleSubmit(console.log)}
			onReset={() => form.reset()}
			id="atleta-form"
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
								<Tooltip content="Buscar atleta">
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
			{/* ADDRESS FIELD */}
			<Controller
				name="address"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						label="Dirección:"
						className="col-span-2"
						description="Ingrese su dirección"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			<h1 className="col-span-2 font-semibold text-lg">Datos de Nacimiento:</h1>
			{/* BIRTH_DATE FIELD */}
			<DatePicker
				showMonthAndYearPickers
				{...form.register("birth_date")}
				onChange={(date) => {
					form.setValue("birth_date", date?.toString() ?? "");

					if (!date) return;

					form.setValue("age", dateHandler(date.toString()));
				}}
				isRequired={!data}
				label="Fecha de nacimiento"
				description="Ingrese la fecha de nacimiento"
				errorMessage={form.formState.errors.birth_date?.message}
			/>
			{/* AGE FIELD */}
			<Controller
				name="age"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<NumberInput
						{...field}
						color={error ? "danger" : "default"}
						onChange={(value) => form.setValue("age", value as number)}
						isReadOnly
						label="Edad:"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			<Controller
				name="birth_place"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						className="col-span-2"
						name="birth_place"
						label="Lugar de nacimiento:"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
		</form>
	);
}
