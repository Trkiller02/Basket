"use client";

import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Check, Search, UserX, X } from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import type { Representative } from "@/utils/interfaces/representative";
import { representativeSchema } from "@/utils/interfaces/schemas";
import { useCallback, useEffect, useState } from "react";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useRouter } from "next/navigation";
import { getEntityData } from "@/lib/action-data";
import { useGetStep } from "@/utils/getStep";
import { Select, SelectItem } from "@heroui/select";
import { relationSelect } from "@/utils/selectList";
import { setUpper } from "@/utils/setUpper";
import { MsgError } from "@/utils/messages";
import { toast } from "sonner";

export default function RepresentativeForm({
	data,
	etapa,
}: { data?: Representative; etapa: "representante" | "madre" | "padre" }) {
	const [disKeys, setDisKeys] = useState<Set<string>>(new Set([]));
	const [relation, setRelation] = useState<string>("representante");
	const [isAvailable, setIsAvailable] = useState<boolean | undefined>();

	const registerData = useRegisterStore((state) => state.registerData);
	const setRegisterData = useRegisterStore((state) => state.setRegisterData);
	const setRelationSearch = useRegisterStore(
		(state) => state.setRelationSearch,
	);
	const router = useRouter();

	const form = useForm<Representative>({
		mode: "all",
		criteriaMode: "firstError",
		defaultValues: data,
		resolver: yupResolver(representativeSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const getStep = useGetStep(etapa, { data: registerData });

	const disabledKeys = useCallback(() => {
		if (registerData.mother && !disKeys.has("madre")) {
			setDisKeys((disKeys) => disKeys.add("madre"));
		}
		if (registerData.father && !disKeys.has("padre")) {
			setDisKeys((disKeys) => disKeys.add("padre"));
		}
		if (registerData.representative && !disKeys.has("representante")) {
			setDisKeys((disKeys) => disKeys.add("representante"));
		}
	}, [disKeys, registerData]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (etapa === "representante" && registerData.representative) {
			if (form.formState.isSubmitting)
				return router.replace(`/registrar?etapa=${getStep()}`);
			form.reset(registerData.representative);
		}
		if (etapa === "madre" && registerData.mother) {
			if (registerData.mother === "omitted")
				return router.replace("/registrar?etapa=padre");

			if (form.formState.isSubmitting)
				return router.replace(`/registrar?etapa=${getStep()}`);

			form.reset(
				typeof registerData.mother === "object"
					? registerData.mother
					: undefined,
			);
		}
		if (etapa === "padre" && registerData.father) {
			if (registerData.father === "omitted")
				return router.replace("/registrar?etapa=resumen");

			if (form.formState.isSubmitting)
				return router.replace(`/registrar?etapa=${getStep()}`);

			form.reset(
				typeof registerData.father === "object"
					? registerData.father
					: undefined,
			);
		}

		disabledKeys();
	}, [registerData]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const temporizador = setTimeout(() => {
			setIsAvailable(undefined);
		}, 3000); // 3000 milisegundos = 3 segundos

		// Limpia el temporizador si el componente se desmonta o el estado cambia antes de que expire el temporizador
		return () => clearTimeout(temporizador);
	}, [isAvailable]);

	const findEntity = async (id: string) => {
		try {
			const response = await getEntityData<Representative>(
				"representatives",
				id.toUpperCase(),
			);
			if (response) setIsAvailable(false);
			return response;
		} catch (error) {
			if ((error as Error).message === MsgError.NOT_FOUND) {
				setIsAvailable(true);

				throw {
					message: "Registro no encontrado",
					description: "Puede continuar con el registro.",
				};
			}

			throw {
				message: "Error al buscar registro",
				description: (error as Error).message,
			};
		}
	};

	const onSubmit = (data: Representative) => {
		if (etapa === "representante")
			setRegisterData({ representative: setUpper<Representative>(data) });
		if (etapa === "madre")
			setRegisterData({ mother: setUpper<Representative>(data) });
		if (etapa === "padre")
			setRegisterData({ father: setUpper<Representative>(data) });
	};

	const onOmit = (entity: string) => {
		if (entity === "madre") setRegisterData({ mother: "omitted" });
		if (entity === "padre") setRegisterData({ father: "omitted" });
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
						endContent={
							!data && typeof isAvailable !== "boolean" ? (
								<Tooltip content="Buscar registro" color="primary">
									<Button
										isDisabled={!field.value}
										isIconOnly
										variant="light"
										aria-label="Buscar entidad"
										className="text-foreground-700"
										onPress={() =>
											toast.promise(findEntity(field.value), {
												loading: "Verificando si existe...",
												description: "Será breve.",
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
											})
										}
									>
										<Search className="px-1" />
									</Button>
								</Tooltip>
							) : (
								<Tooltip
									content={isAvailable ? "Disponible" : "Registrado"}
									color="default"
								>
									<div
										className={`w-6 h-6 flex justify-center items-center rounded-full ${isAvailable ? "bg-success" : "bg-danger"}`}
									>
										{isAvailable ? (
											<Check className="text-white py-2" />
										) : (
											<X className="text-white py-2" />
										)}
									</div>
								</Tooltip>
							)
						}
					/>
				)}
			/>

			<div className="flex flex-row gap-2">
				<Select
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
				</Select>
				{!data && (
					<Tooltip content="Omitir Relación">
						<Button
							isDisabled={
								!!relation &&
								disKeys.size <= 2 &&
								!data &&
								relation === "representante"
							}
							variant="light"
							isIconOnly
							aria-label="Omitir Relación"
							className="text-foreground-700 mt-2"
							onPress={() => onOmit(relation)}
						>
							<UserX className="px-1" />
						</Button>
					</Tooltip>
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
		</form>
	);
}
