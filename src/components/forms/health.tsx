"use client";

import type { Health } from "@/utils/interfaces/health";
import { healthSchema } from "@/utils/interfaces/schemas";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@heroui/theme";
import { Select, SelectItem } from "@heroui/select";
import { bloodList } from "@/utils/selectList";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetStep } from "@/utils/getStep";
import { setUpper } from "@/utils/setUpper";

export default function HealthForm({ data }: { data?: Health }) {
	const router = useRouter();
	const registerData = useRegisterStore((state) => state.registerData);
	const setRegisterData = useRegisterStore((state) => state.setRegisterData);
	const getStep = useGetStep("salud", { data: registerData });

	const form = useForm<Health>({
		criteriaMode: "firstError",
		mode: "all",
		defaultValues: data,
		resolver: yupResolver(healthSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const onSubmit = (data: Health) => {
		setRegisterData({ health: setUpper<Health>(data) });
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <just executes when registerData changes>
	useEffect(() => {
		if (registerData.health) {
			form.reset(registerData.health);
		}

		if (form.formState.isSubmitting && registerData.health) {
			router.replace(`/registrar?etapa=${getStep()}`);
		}
	}, [registerData]);

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
		</form>
	);
}
