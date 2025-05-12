"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { setEntityData } from "@/lib/action-data";
import { toast } from "sonner";
import { Button } from "@heroui/button";
import { useSession } from "@/lib/auth-client";

export default function RepresentSignin() {
	const router = useRouter();
	const { data: session } = useSession();

	const form = useForm<{ occupation: string; height: number }>({
		criteriaMode: "firstError",
		mode: "all",
		resolver: yupResolver(
			Yup.object({
				occupation: Yup.string().required("Requerido"),
				height: Yup.number()
					.positive("Debe ser positivo")
					.required("Requerido"),
			}),
		),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const onSubmit = async (data: { occupation: string; height: number }) => {
		try {
			const response = await setEntityData<{ message: string }>(
				"representatives",
				{
					...data,
					user_id: session?.user?.id,
				},
			);

			if (response) return "Se ha registrado correctamente";
		} catch (error) {
			throw {
				message: "Error al registrar",
				description: (error as Error).message,
			};
		}
	};

	return (
		<Card className="md:w-1/4 p-2 border-2 border-primary">
			<CardHeader>
				<h1 className="text-2xl font-medium text-center">
					Completa tus datos personales
				</h1>
			</CardHeader>
			<CardBody>
				<form
					id="represent-signin-form"
					onSubmit={form.handleSubmit((values) =>
						toast.promise(onSubmit(values), {
							loading: "Completando...",
							description: "Por favor espere.",
							success: (data) => {
								router.push("/");
								return data;
							},
							error: (error) => error,
						}),
					)}
				>
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
			</CardBody>
			<CardFooter>
				<Button
					type="submit"
					className="col-span-2"
					fullWidth
					color="primary"
					form="represent-signin-form"
					isLoading={form.formState.isSubmitting}
				>
					Completar
				</Button>
			</CardFooter>
		</Card>
	);
}
