"use client";

import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Check, Search, Upload, UserCircle, X } from "lucide-react";
import { DatePicker } from "@heroui/date-picker";
import { getLocalTimeZone, parseDate } from "@internationalized/date";

import { dateHandler } from "@/utils/dateHandler";

import type { Athlete } from "@/utils/interfaces/athlete";

import { setUpper } from "@/utils/setUpper";
import { useEffect } from "react";
import { athleteSchema } from "@/utils/interfaces/schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateEntityData } from "@/lib/action-data";
import { addToast } from "@heroui/toast";

export function AthletesEditForm({ data }: { data: Athlete }) {
	const router = useRouter();

	useEffect(() => form.reset(data), [data]);

	const form = useForm<Partial<Athlete>>({
		criteriaMode: "firstError",
		mode: "all",
		resolver: yupResolver(athleteSchema.partial()),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const onSubmit = async (updateData: Partial<Athlete>) => {
		const response = await updateEntityData<{ message: string }>(
			"athletes",
			data.id ?? "",
			setUpper(updateData),
		);

		if (response)
			addToast({
				title: "Completado.",
				description: response.message,
				color: "success",
			});
	};

	return (
		<form
			className="flex flex-col md:grid grid-cols-2 gap-3 w-full"
			onSubmit={form.handleSubmit(onSubmit)}
			onReset={() => form.reset()}
			id="atleta-form"
		>
			<h1 className="col-span-2 font-semibold text-lg">Datos personales:</h1>

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
						description="V30... ó E23..."
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>

			<div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
				{form.watch("image") ? (
					<Image
						src={form.watch("image") ?? ""}
						alt="Athlete image"
						fill
						className="object-cover"
					/>
				) : (
					<UserCircle className="w-full aspect-square h-auto text-foreground-700" />
				)}
			</div>

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
						description="Ej: pedro123@gmail.com"
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
						color={error ? "danger" : "default"}
						label="Número telefónico:"
						description="Ej: 0424..."
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
				{...form.register("birth_date")}
				showMonthAndYearPickers
				value={
					form.watch("birth_date")
						? parseDate(
								form.watch("birth_date")?.split("T")[0] ??
									new Date().toISOString().split("T")[0],
							)
						: undefined
				}
				onChange={(date) => {
					console.log(date?.toDate(getLocalTimeZone()).toISOString());

					form.setValue(
						"birth_date",
						date?.toDate(getLocalTimeZone()).toISOString() ?? "",
					);
					form.setValue("age", dateHandler(date?.toString()));
				}}
				isRequired={!data}
				label="Fecha de nacimiento"
				minValue={parseDate(`${new Date().getFullYear()}-01-01`).subtract({
					years: 20,
				})}
				maxValue={parseDate(`${new Date().getFullYear()}-12-31`).subtract({
					years: 4,
				})}
				isInvalid={!!form.formState.errors.birth_date}
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
			<div className="flex justify-between items-center col-span-2 pt-2">
				<Button onPress={() => router.back()} color="danger">
					Cancelar
				</Button>
				<Button
					type="submit"
					color="primary"
					isDisabled={!form.formState.isValid}
				>
					Enviar
				</Button>
			</div>
		</form>
	);
}
