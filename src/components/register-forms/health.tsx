"use client";

import type { Health } from "@/utils/interfaces/health";
import { healthSchema } from "@/utils/interfaces/schemas";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { bloodList } from "@/utils/selectList";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetStep } from "@/utils/getStep";
import { setUpper } from "@/utils/setUpper";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";

export default function HealthForm({ data }: { data?: Health }) {
	const router = useRouter();
	const registerData = useRegisterStore((state) => state.registerData);
	const setRegisterData = useRegisterStore((state) => state.setRegisterData);
	const getStep = useGetStep("salud", { data: registerData });

	const form = useForm<Health>({
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
		<Form {...form}>
			<form
				className="flex flex-col md:grid grid-cols-2 gap-3"
				onReset={() => form.reset()}
				onSubmit={form.handleSubmit(onSubmit)}
				id="salud-form"
			>
				{/* BLOOD_TYPE FIELD */}
				<FormField
					control={form.control}
					name="blood_type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipo de sangre:</FormLabel>
							<Select defaultValue={field.value} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Seleccione una opción" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{bloodList.map(({ key }) => (
										<SelectItem key={key} value={key}>
											{key}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex flex-col md:flex-row gap-2">
					{/* MEDICAL_AUTHORIZATION FIELD */}
					<FormField
						control={form.control}
						name="medical_authorization"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
									<FormControl>
										<Checkbox
											onCheckedChange={field.onChange}
											defaultChecked={field.value}
											className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
										/>
									</FormControl>
									<div className="grid gap-1.5 font-normal">
										<p className="text-sm leading-none font-medium">
											Autorización médica
										</p>
										<p className="text-muted-foreground text-xs">
											Salud optima para realizar deportes.
										</p>
									</div>
								</FormLabel>

								<FormMessage />
							</FormItem>
						)}
					/>

					{/* HAS_ASTHMA FIELD */}
					<FormField
						control={form.control}
						name="has_asthma"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
									<FormControl>
										<Checkbox
											onCheckedChange={field.onChange}
											defaultChecked={field.value}
											className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
										/>
									</FormControl>
									<div className="grid gap-1.5 font-normal">
										<p className="text-sm leading-none font-medium">Asma</p>
										<p className="text-muted-foreground text-xs">
											Padece dificultad para respirar.
										</p>
									</div>
								</FormLabel>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* TAKES_MEDICATIONS FIELD */}
				<FormField
					control={form.control}
					name="takes_medications"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Consume algun medicamento:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ingrese su medicamento"
									defaultValue={field.value}
								/>
							</FormControl>
							<FormDescription>Ej: Paracetamol</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* HAS_ALLERGIES FIELD */}
				<FormField
					control={form.control}
					name="has_allergies"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Alergias:</FormLabel>
							<FormControl>
								<Input defaultValue={field.value} />
							</FormControl>
							<FormDescription>
								¿Es alergico a algun medicamento?
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* SURGICAL_INTERVENTION FIELD */}
				<FormField
					control={form.control}
					name="surgical_intervention"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Intervención quirúrgica:</FormLabel>
							<FormControl>
								<Input placeholder="Ej: Rodillas" defaultValue={field.value} />
							</FormControl>
							<FormDescription>
								Si alguna vez ha sido operado. ¿En que parte del cuerpo?
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* INJURIES FIELD */}
				<FormField
					control={form.control}
					name="injuries"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Presenta alguna lesión:</FormLabel>
							<FormControl>
								<Input placeholder="Ej: Rodillas" defaultValue={field.value} />
							</FormControl>
							<FormDescription>¿En que parte del cuerpo?</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* CURRENT_ILLNESSES FIELD */}
				<FormField
					control={form.control}
					name="current_illnesses"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Estado de salud actualmente:</FormLabel>
							<FormControl>
								<Input placeholder="Saludable" defaultValue={field.value} />
							</FormControl>
							<FormDescription>
								Describa su estado actual de salud
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
