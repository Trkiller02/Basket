"use client";

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
import { findEntity } from "@/utils/getEntity";
import { InputForm } from "../form/input";
import { Upload } from "lucide-react";
import { Form } from "../ui/form";

const AthleteForm = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const registerData = useRegisterStore((state) => state.registerData);
	const setRegisterData = useRegisterStore((state) => state.setRegisterData);
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (registerData.athlete) {
			if (form.formState.isSubmitting)
				return router.replace(`/registrar?etapa=${getStep()}`);

			form.reset(registerData.athlete);
		}
	}, [registerData]);

	return (
		<Form {...form}>
			<form
				className="flex flex-col md:grid grid-cols-2 gap-3 w-full"
				onSubmit={form.handleSubmit(onSubmit)}
				onReset={() => form.reset()}
				id="atleta-form"
			>
				<h1 className="col-span-2 font-semibold text-lg">Datos personales:</h1>
				<InputForm label="Cedula de identidad" name="user_id.ci_number" />
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
				<InputForm label="Nombre" name="user_id.name" />
				<InputForm label="Apellido" name="user_id.lastname" />
			</form>
		</Form>
	);
};
