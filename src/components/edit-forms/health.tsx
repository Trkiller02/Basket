"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { updateEntityData } from "@/lib/action-data";
import type { Health } from "@/utils/interfaces/health";
import { setUpper } from "@/utils/setUpper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { addToast } from "@heroui/toast";
import { healthSchema } from "@/utils/schemas/health";
import { Select, SelectItem } from "@heroui/select";
import { bloodList } from "@/utils/selectList";
import { Checkbox } from "@heroui/checkbox";
import { cn } from "@heroui/theme";

export default function HealthEditForm({ data }: { data?: Health }) {
	const router = useRouter();

	const form = useForm<Partial<Health>>({
		criteriaMode: "firstError",
		mode: "all",
		defaultValues: data,
		resolver: yupResolver(healthSchema.partial()),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const onSubmit = async (updateData: Partial<Health>) => {
		const response = await updateEntityData<{ message: string }>(
			"health",
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		form.reset(data);
	}, [data]);

	return (
		<form
			className="flex flex-col md:grid grid-cols-2 gap-3"
			onReset={() => form.reset()}
			onSubmit={form.handleSubmit(onSubmit)}
			id="salud-form"
		>
			{/* BLOOD_TYPE FIELD */}
			<Controller
				control={form.control}
				name="blood_type"
				render={({ field, fieldState: { error } }) => (
					<Select
						{...field}
						isInvalid={!!error}
						selectedKeys={field.value ? [field.value] : undefined}
						errorMessage={error?.message}
						label="Tipo de sangre"
						description="¿Cuál es su tipo de sangre?"
						items={bloodList}
					>
						{({ key }) => <SelectItem key={key}>{key}</SelectItem>}
					</Select>
				)}
			/>

			<div className="flex flex-col md:flex-row">
				{/* MEDICAL_AUTHORIZATION FIELD */}
				<Controller
					control={form.control}
					name="medical_authorization"
					render={({ field, fieldState: { error } }) => {
						const { value, ...restField } = field;
						return (
							<Checkbox
								{...restField}
								isSelected={value}
								isInvalid={!!error}
								classNames={{
									base: cn(
										"bg-default-100",
										"hover:bg-default-200",
										"r rounded-xl m-1 border-2 border-transparent",
										"data-[selected=true]:border-primary",
									),
									label: "w-full",
								}}
							>
								<div className="flex flex-col items-start">
									<p>Autorización médica</p>
									<span
										className={`text-tiny ${error ? "text-danger" : "text-default-500"}`}
									>
										{error
											? error.message
											: "Optimamente para realizar deportes."}
									</span>
								</div>
							</Checkbox>
						);
					}}
				/>

				{/* HAS_ASTHMA FIELD */}
				<Controller
					control={form.control}
					name="has_asthma"
					render={({ field, fieldState: { error } }) => {
						const { value, ...restField } = field;
						return (
							<Checkbox
								{...restField}
								isSelected={value}
								isInvalid={!!error}
								classNames={{
									base: cn(
										"bg-default-100",
										"hover:bg-default-200",
										"r rounded-xl m-1 border-2 border-transparent",
										"data-[selected=true]:border-primary",
									),
									label: "w-full",
								}}
							>
								<div className="flex flex-col items-start">
									<p>Asma</p>
									<span
										className={`text-tiny ${error ? "text-danger" : "text-default-500"}`}
									>
										{error ? error.message : "Padece dificultad para respirar."}
									</span>
								</div>
							</Checkbox>
						);
					}}
				/>
			</div>

			{/* TAKES_MEDICATIONS FIELD */}
			<Controller
				control={form.control}
				name="takes_medications"
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						label="Consume algun medicamento:"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>

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
						isInvalid={!!error}
						errorMessage={error?.message}
						className="col-span-2"
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
