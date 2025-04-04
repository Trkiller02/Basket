"use client";

import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Check, Search, Upload, X } from "lucide-react";
import { DatePicker } from "@heroui/date-picker";
import { getLocalTimeZone, parseDate } from "@internationalized/date";

import { dateHandler } from "@/utils/dateHandler";

import type { Athlete } from "@/utils/interfaces/athlete";
import { athleteSchema } from "@/utils/interfaces/schemas";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useGetStep } from "@/utils/getStep";
import { useEffect, useRef, useState, memo } from "react";
import { getEntityData } from "@/lib/action-data";
import Image from "next/image";
import { setUpper } from "@/utils/setUpper";
import { getCategories } from "@/utils/getCategories";
import { toast } from "sonner";
import { MsgError } from "@/utils/messages";

function AthleteForm() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const registerData = useRegisterStore((state) => state.registerData);
	const setRegisterData = useRegisterStore((state) => state.setRegisterData);
	const [isAvailable, setIsAvailable] = useState<boolean | undefined>();
	const getStep = useGetStep("atleta", { data: registerData });

	const handleIconClick = () => {
		// Trigger the hidden file input when the icon is clicked
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			const lector = new FileReader();
			lector.onload = (evento) => {
				form.setValue("image", evento.target?.result?.toString());
			};

			lector.readAsDataURL(file);
		}
	};

	const form = useForm<Athlete>({
		criteriaMode: "firstError",
		mode: "all",
		resolver: yupResolver(athleteSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const onSubmit = (data: Athlete) => {
		setRegisterData({
			athlete: setUpper<Athlete>({
				...data,
				category: getCategories(data.age),
			}),
		});
	};

	const findEntity = async (id: string) => {
		try {
			const response = await getEntityData<Athlete>(
				"athletes",
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const temporizador = setTimeout(() => {
			setIsAvailable(undefined);
		}, 3000); // 3000 milisegundos = 3 segundos

		// Limpia el temporizador si el componente se desmonta o el estado cambia antes de que expire el temporizador
		return () => clearTimeout(temporizador);
	}, [isAvailable]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (registerData.athlete) {
			if (form.formState.isSubmitting)
				return router.replace(`/registrar?etapa=${getStep()}`);

			form.reset(registerData.athlete);
		}
	}, [registerData]);

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
						isRequired
						color={error ? "danger" : "default"}
						label="Cédula de identidad:"
						description="V30... ó E23..."
						isInvalid={!!error}
						errorMessage={error?.message}
						endContent={
							typeof isAvailable !== "boolean" ? (
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
														description: "¿Desea editarlo?",
														action: {
															label: "Editar",
															onClick: () =>
																router.replace(`/editar/atleta/${field.value}`),
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

			<div className="inline-flex items-center gap-4">
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary bg-gray-50 hover:bg-gray-100"
					onClick={handleIconClick}
				>
					{form.watch("image") ? (
						// Show the uploaded image
						<Image
							src={form.watch("image") ?? ""}
							alt="Uploaded image"
							fill
							className="object-cover"
						/>
					) : (
						// Show the upload icon
						<Upload className="h-12 w-12 text-gray-400 py-2" />
					)}
					<input
						{...form.register("image")}
						ref={fileInputRef}
						type="file"
						onChange={handleFileChange}
						hidden
						accept="image/*"
					/>
				</div>

				<div className="flex flex-col">
					<h6>Fotografia del atleta</h6>
					<p className="text-sm text-gray-500">
						La fotografía debe ser tipo carnet.
					</p>
				</div>
			</div>
			{/* NAME FIELD */}
			<Controller
				name="user_id.name"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						color={error ? "danger" : "default"}
						isRequired
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
						isRequired
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
						? parseDate(form.watch("birth_date").split("T")[0])
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
				isRequired
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
		</form>
	);
}

export default memo(AthleteForm);
