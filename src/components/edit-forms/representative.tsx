"use client";

import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Button } from "@heroui/button";

import type { Representative } from "@/utils/interfaces/representative";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { setUpper } from "@/utils/setUpper";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { representativeSchema } from "@/utils/interfaces/schemas";
import { updateEntityData } from "@/lib/action-data";
import { use, useEffect } from "react";

export function RepresentativeEditForm({ data }: { data: Representative }) {
	const router = useRouter();

	const form = useForm<Partial<Representative>>({
		mode: "all",
		criteriaMode: "firstError",
		resolver: yupResolver(representativeSchema.partial()),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => form.reset(data), [data]);

	const onSubmit = async (updateData: Partial<Representative>) => {
		const response = await updateEntityData<{ message: string }>(
			"representatives",
			data?.id ?? "",
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
			className="grid grid-cols-2 gap-3 w-full"
			onSubmit={form.handleSubmit(onSubmit)}
			onReset={() => form.reset()}
			id="representante-form"
		>
			<h3 className="col-span-2 font-semibold text-lg">Datos personales:</h3>
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
						label="Estatura:"
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
