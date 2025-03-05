"use client";

import type { Health } from "@/utils/interfaces/health";
import { healthSchema, initValHealth } from "@/utils/schemas/health";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

export default function HealthForm({ data }: { data?: Health }) {
	const form = useForm<Health>({
		reValidateMode: "onChange",
		mode: "all",
		defaultValues: data ?? initValHealth,
		resolver: yupResolver(healthSchema),
	});

	return (
		<form
			className="grid grid-cols-2 gap-3 w-full"
			onReset={() => form.reset()}
			onSubmit={form.handleSubmit(console.log)}
			id="salud-form"
		>
			{/* HAS_ASTHMA FIELD */}
			<Checkbox {...form.register("has_asthma")}>¿Padece de asma?</Checkbox>

			{/* HAS_ALLERGIES FIELD */}

			<Controller
				control={form.control}
				name="has_allergies"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						label="Alergias:"
						description="¿Es alergico a algun medicamento?"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>

			{/* TAKES_MEDICATIONS FIELD */}
			<Controller
				control={form.control}
				name="takes_medications"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						isRequired={!data}
						label="Consume algun medicamento:"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>

			{/* SURGICAL_INTERVENTION FIELD */}
			<Controller
				control={form.control}
				name="surgical_intervention"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						label="Intervención quirúrgica:"
						description="Si alguna ha sido operado. ¿En que parte del cuerpo?"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>

			{/* INJURIES FIELD */}
			<Controller
				control={form.control}
				name="injuries"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						label="Presenta alguna lesión:"
						description="Si alguna ha sido operado. ¿En que parte del cuerpo?"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>

			{/* CURRENT_ILLNESSES FIELD */}
			<Controller
				control={form.control}
				name="current_illnesses"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						label="Estado de salud actualmente:"
						description="Describa su estado actual de salud"
						className="col-span-2"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
		</form>
	);
}
