"use client";

import type { Health } from "@/utils/interfaces/health";
import { healthSchema, initValHealth } from "@/utils/schemas/health";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export default function HealthForm({ data }: { data?: Health }) {
	const form = useForm<Health>({
		reValidateMode: "onChange",
		mode: "all",
		defaultValues: data ?? initValHealth,
		resolver: yupResolver(healthSchema),
	});

	return (
		<form
			className="h-2/4 w-3/4 border border-gray-300 rounded-xl shadow-xl p-8"
			onReset={() => form.reset()}
			onSubmit={form.handleSubmit(console.log)}
			id="salud-form"
		>
			<Input
				{...form.register("takes_medications")}
				isRequired={!data}
				label="Consume algun medicamento:"
				variant="bordered"
				errorMessage={form.formState.errors.takes_medications?.message}
				className="col-span-4"
			/>

			{/* LASTNAME FIELD */}
			<Input
				{...form.register("has_allergies")}
				label="Alergias:"
				description="¿Es alergico a algun medicamento?"
				variant="bordered"
				errorMessage={form.formState.errors.has_allergies?.message}
				className="col-span-4"
			/>

			{/* EMAIL FIELD */}
			<Input
				{...form.register("surgical_intervention")}
				label="Intervención quirúrgica:"
				description="Si alguna ha sido operado. ¿En que parte del cuerpo?"
				variant="bordered"
				errorMessage={form.formState.errors.surgical_intervention?.message}
				className="col-span-3"
			/>

			{/* PHONE_NUMBER FIELD */}
			<Input
				{...form.register("injuries")}
				label="Presenta alguna lesión:"
				variant="bordered"
				errorMessage={form.formState.errors.injuries?.message}
				className="col-span-3"
			/>

			<Input
				{...form.register("current_illnesses")}
				label="Estado de salud actualmente:"
				description="Describa su estado actual de salud"
				variant="bordered"
				errorMessage={form.formState.errors.current_illnesses?.message}
				className="col-span-3"
			/>

			<Checkbox {...form.register("has_asthma")}>¿Padece de asma?</Checkbox>
		</form>
	);
}
