"use client";

import type { Health } from "@/utils/interfaces/health";
import { healthSchema } from "@/utils/interfaces/schemas";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { bloodList } from "@/utils/selectList";
import { useEffect } from "react";
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
import { fetchData } from "@/utils/fetchHandler";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Link from "next/link";
import { Save } from "lucide-react";

export default function HealthEditForm({ data }: { data?: Health }) {
	const form = useForm<Partial<Health>>({
		resolver: yupResolver(healthSchema.partial()),
	});

	const onSubmit = async (data: Partial<Health>) =>
		await fetchData<{ message: string }>(`/api/health/${data.id}`, {
			body: setUpper(data),
			method: "PATCH",
		});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <just executes when registerData changes>
	useEffect(() => {
		form.reset(data);
	}, [data]);

	return (
		<Form {...form}>
			<form
				className="flex flex-col md:grid grid-cols-2 gap-3"
				onReset={() => form.reset()}
				onSubmit={form.handleSubmit((values) =>
					toast.promise(onSubmit(values), {
						loading: "Guardando...",
						success: (data) => data?.message ?? "Datos guardados",
						error: (error) => error.message,
					}),
				)}
			>
				<h1 className="col-span-2 font-semibold text-lg">Datos medicos:</h1>
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

				<div className="col-span-2 inline-flex items-center gap-4 justify-end">
					<Button variant="outline" asChild>
						<Link href="/">Cancelar</Link>
					</Button>
					<Button type="submit" className="flex items-center space-x-2">
						<Save className="h-4 w-4" />
						<span>Guardar</span>
					</Button>
				</div>
			</form>
		</Form>
	);
}
