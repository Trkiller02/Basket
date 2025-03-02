"use client";

import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Search } from "lucide-react";
import { DatePicker } from "@heroui/date-picker";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import type { Athlete } from "@/utils/interfaces/athlete";
import { athleteSchema, initValAthlete } from "@/utils/schemas/athlete";
import { dateHandler } from "@/utils/dateHandler";

export default function AthleteForm({ data }: { data?: Athlete }) {
	const form = useForm<Athlete>({
		reValidateMode: "onChange",
		mode: "all",
		defaultValues: data ?? initValAthlete,
		resolver: yupResolver(athleteSchema),
	});

	return (
		<form
			className="h-2/4 w-3/4 border border-gray-300 rounded-xl shadow-xl p-8 grid grid-cols-8 gap-3"
			onReset={() => form.reset()}
			onSubmit={form.handleSubmit(console.log)}
			id="atleta-form"
		>
			{/* CI FIELD */}
			<Input
				{...form.register("user_id.ci_number")}
				isRequired={!data}
				name="user_id.ci_number"
				label="Cédula de identidad:"
				description="Ingrese su Cédula de identidad"
				variant="bordered"
				errorMessage={form.formState.errors.user_id?.ci_number?.message}
				className="col-span-2"
			/>

			{/* SEARCH BUTTON */}
			{!data && (
				<Tooltip
					content="Buscar Estudiante"
					className="border border-primary-500"
				>
					<Button
						isDisabled={!form.watch("user_id.ci_number")}
						isIconOnly
						color="primary"
						variant="ghost"
						aria-label="Buscar entidad"
						className="w-3/4 h-3/4"
						onPress={
							() => {}
							/* toast.promise(searchStudent(values.person_id?.ci_number), {
									loading: "Procesando...",
									success: (data) => {
										router.push(`/search/student/${data?.ci_number}`);
										return "Búsqueda exitosa.";
									},
									error: (error: Error) => {
										if (error.message === "Failed to fetch") {
											return "Error en conexión.";
										}
										return error.message;
									},
								}) */
						}
					>
						<Search className="text-2xl" />
					</Button>
				</Tooltip>
			)}

			<span className="col-span-2">&nbsp;</span>

			{/* NAME FIELD */}
			<Input
				{...form.register("user_id.name")}
				name="user_id.name"
				isRequired={!data}
				label="Nombres:"
				description="Ingrese sus Nombres"
				variant="bordered"
				errorMessage={form.formState.errors.user_id?.name?.message}
				className="col-span-4"
			/>

			{/* LASTNAME FIELD */}
			<Input
				{...form.register("user_id.lastname")}
				name="user_id.lastname"
				isRequired={!data}
				label="Apellidos:"
				description="Ingrese sus Apellidos"
				variant="bordered"
				errorMessage={form.formState.errors.user_id?.lastname?.message}
				className="col-span-4"
			/>

			{/* EMAIL FIELD */}
			<Input
				{...form.register("user_id.email")}
				name="user_id.email"
				label="Correo electrónico:"
				type="email"
				description="Ingrese su correo electrónico"
				variant="bordered"
				errorMessage={form.formState.errors.user_id?.email?.message}
				className="col-span-3"
			/>

			{/* PHONE_NUMBER FIELD */}
			<Input
				{...form.register("user_id.phone_number")}
				name="user_id.phone_number"
				label="Número telefónico:"
				description="Ingrese su número de teléfono"
				variant="bordered"
				errorMessage={form.formState.errors.user_id?.phone_number?.message}
				className="col-span-3"
			/>

			<Input
				{...form.register("address")}
				name="address"
				label="Dirección:"
				description="Ingrese su dirección"
				variant="bordered"
				errorMessage={form.formState.errors.address?.message}
				className="col-span-3"
			/>

			<h1 className="col-span-8 font-semibold text-lg">Datos de Nacimiento:</h1>

			<Input
				{...form.register("birth_place")}
				name="birth_place"
				label="Lugar de nacimiento:"
				variant="bordered"
				errorMessage={form.formState.errors.birth_place?.message}
				className="col-span-3"
			/>

			{/* BIRTH_DATE FIELD */}
			<DatePicker
				showMonthAndYearPickers
				{...form.register("birth_date")}
				name="birth_date"
				onChange={(date) => {
					form.setValue("birth_date", date?.toString() ?? "");

					if (!date) return;

					form.setValue("age", dateHandler(date.toString()));
				}}
				isRequired={!data}
				label="Fecha de nacimiento"
				description="Ingrese la fecha de nacimiento"
				className="col-span-3"
				errorMessage={form.formState.errors.birth_date?.message}
			/>

			<NumberInput
				{...form.register("age")}
				name="age"
				onChange={(value) => form.setValue("age", value as number)}
				isReadOnly
				label="Edad:"
				variant="bordered"
				errorMessage={form.formState.errors.birth_place?.message}
				className="col-span-3"
			/>
		</form>
	);
}
