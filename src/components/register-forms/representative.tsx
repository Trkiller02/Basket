"use client";

import { Search, UserX, UserX2, X } from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import type { Representative } from "@/utils/interfaces/representative";
import { representativeSchema } from "@/utils/interfaces/schemas";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useRouter } from "next/navigation";
import { useGetStep } from "@/utils/getStep";
import { setUpper } from "@/utils/setUpper";
import { toast } from "sonner";
import { findEntity } from "@/utils/getEntity";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export default function RepresentativeForm({
	etapa,
}: {
	etapa: "representante" | "madre" | "padre";
}) {
	const [disKeys, setDisKeys] = useState<Set<string>>(new Set([]));

	const registerData = useRegisterStore((state) => state.registerData);
	const setRegisterData = useRegisterStore((state) => state.setRegisterData);
	const setRelationSearch = useRegisterStore(
		(state) => state.setRelationSearch,
	);
	const router = useRouter();

	const form = useForm<Representative & { tutor?: boolean }>({
		defaultValues: {
			user_id: {
				ci_number: "V",
			},
		},
		resolver: yupResolver(representativeSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const getStep = useGetStep(etapa, { data: registerData });

	const key = useMemo(
		() =>
			etapa === "madre"
				? "mother"
				: etapa === "padre"
					? "father"
					: "representative",
		[etapa],
	);

	const disabledKeys = useCallback(() => {
		if (registerData.mother && !disKeys.has("madre")) {
			setDisKeys((disKeys) => disKeys.add("madre"));
		}
		if (registerData.father && !disKeys.has("padre")) {
			setDisKeys((disKeys) => disKeys.add("padre"));
		}
		if (
			(registerData.representative || registerData.tutor) &&
			!disKeys.has("representante")
		) {
			setDisKeys((disKeys) => disKeys.add("representante"));
		}
	}, [disKeys, registerData]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (registerData[key]) {
			if (form.formState.isSubmitting || typeof registerData[key] === "string")
				return router.replace(`/registrar?etapa=${getStep()}`);

			form.reset(
				typeof registerData[key] === "object"
					? registerData[key]
					: {
							user_id: {
								ci_number: registerData.representative as string,
							},
						},
			);
		}

		disabledKeys();
	}, [registerData, etapa]);

	return (
		<Form {...form}>
			<form
				className="grid grid-cols-2 gap-3 w-full"
				onSubmit={form.handleSubmit((data) =>
					setRegisterData({
						[key]: setUpper<Representative>(data),
						tutor: data.tutor ? key : undefined,
					}),
				)}
				onReset={() => form.reset()}
				id={`${etapa}-form`}
			>
				<h3 className="col-span-2 font-semibold text-lg">Datos personales:</h3>
				{/* CI FIELD */}
				<FormField
					control={form.control}
					name="user_id.ci_number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cédula de identidad:</FormLabel>
							<FormControl>
								<div className="flex items-center gap-2 w-full">
									<Select
										onValueChange={(value) =>
											field.onChange(value + (field.value?.slice(1) ?? ""))
										}
										defaultValue={field.value?.charAt(0) ?? "V"}
									>
										<SelectTrigger>
											<SelectValue placeholder="V" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="V">V</SelectItem>
											<SelectItem value="E">E</SelectItem>
										</SelectContent>
									</Select>
									<div className="relative">
										<Input
											placeholder="3..."
											type="tel"
											className="peer pe-9"
											required
											defaultValue={field.value?.slice(1) ?? ""}
											onChange={({ target: { value: number } }) =>
												field.onChange(field.value?.slice(0, 1) + number)
											}
										/>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													disabled={!field.value}
													type="button"
													size="icon"
													variant="link"
													aria-label="Buscar entidad"
													className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground/80 peer-disabled:opacity-50"
													onClick={() =>
														toast.promise(
															findEntity(field.value, registerData),
															{
																loading: "Verificando si existe...",
																success: (data) => {
																	return {
																		message: "Registro encontrado",
																		description: "¿Relacionarlo con el atleta?",
																		action: {
																			label: "Si",
																			onClick: () => {
																				setRelationSearch?.(field.value);
																				router.replace(
																					`/registrar?etapa=${etapa}&modal=true`,
																				);
																			},
																		},
																	};
																},
																error: (error) => error,
															},
														)
													}
												>
													<Search />
												</Button>
											</TooltipTrigger>
											<TooltipContent>Buscar registro</TooltipContent>
										</Tooltip>
									</div>
								</div>
							</FormControl>
							<FormDescription>Prefijo: V o E. Ej: V30...</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex flex-row gap-2">
					{/* <Select
					items={relationSelect}
					label="Relación:"
					selectedKeys={relation ? [relation] : undefined}
					disabledKeys={Array.from(disKeys)}
					description={"Ingrese la relación con el estudiante."}
					onSelectionChange={(value) => setRelation(value.currentKey ?? "")}
					isRequired
				>
					{({ value, key }: { value: string; key: string }) => (
						<SelectItem key={key}>{value}</SelectItem>
					)}
				</Select> */}

					{/* TUTOR FIELD */}
					<FormField
						control={form.control}
						name="tutor"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
									<FormControl>
										<Checkbox
											onCheckedChange={field.onChange}
											defaultChecked={field.value || disKeys.size >= 2}
											className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
										/>
									</FormControl>
									<div className="grid gap-1.5 font-normal">
										<p className="text-sm leading-none font-medium">
											Tutor legal
										</p>
										<p className="text-muted-foreground text-sm">
											Responsable del atleta.
										</p>
									</div>
								</FormLabel>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								disabled={
									disKeys.size >= 2 ||
									(disKeys.size >= 2 && etapa === "representante")
								}
								size="icon"
								aria-label="omitir entidad"
								className="self-center"
								onClick={() => setRegisterData({ [key]: "omitted" })}
							>
								<UserX2 className="text-current size-8 px-1" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Omitir Relación</TooltipContent>
					</Tooltip>
				</div>

				{/* NAME FIELD */}
				<FormField
					control={form.control}
					name={"user_id.name"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombres:</FormLabel>
							<FormControl>
								<Input placeholder="Ingrese sus Nombres" {...field} required />
							</FormControl>
							<FormDescription>Ej: Maria Jose</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* LASTNAME FIELD */}
				<FormField
					control={form.control}
					name={"user_id.lastname"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Apellidos:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ingrese sus Apellidos"
									{...field}
									required
								/>
							</FormControl>
							<FormDescription>Ej: Perez Marquez</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* EMAIL FIELD */}
				<FormField
					control={form.control}
					name={"user_id.email"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Correo electrónico:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ej: pedro123@gmail.com"
									{...field}
									required
									type="email"
								/>
							</FormControl>
							<FormDescription>Ej: pedro123@gmail.com</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* PHONE_NUMBER FIELD */}
				<FormField
					control={form.control}
					name={"user_id.phone_number"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Número telefónico:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ingrese su numero telefonico"
									{...field}
									required
									type="tel"
								/>
							</FormControl>
							<FormDescription>Ej: 0424...</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col md:grid grid-cols-3 gap-3 col-span-2">
					{/* OCCUPATION FIELD */}
					<FormField
						control={form.control}
						name="occupation"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ocupación:</FormLabel>
								<FormControl>
									<Input
										placeholder="Ingrese su ocupación"
										{...field}
										required
									/>
								</FormControl>
								<FormDescription>¿En qué ocupación trabaja?</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* 
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
					/> */}
					{/* HEIGHT FIELD */}
					<FormField
						control={form.control}
						name="height"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estatura:</FormLabel>
								<FormControl>
									<Input
										{...field}
										required
										type="number"
										min={100}
										max={300}
									/>
								</FormControl>
								<FormDescription>Ingrese su estatura</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/*
					<Controller
						control={form.control}
						name="height"
						render={({ field, fieldState: { error } }) => (
							<NumberInput
								step={0.01}
								{...field}
								label="Estatura:"
								isInvalid={!!error}
								errorMessage={error?.message}
							/>
						)}
					/> */}
				</div>
			</form>
		</Form>
	);
}
