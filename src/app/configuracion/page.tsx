"use client";

import { setEntityData } from "@/lib/action-data";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { NumberInput } from "@heroui/number-input";
import { addToast } from "@heroui/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function Page() {
	const form = useForm<{ pricing: number }>({
		criteriaMode: "firstError",
		mode: "all",
		resolver: yupResolver(
			Yup.object().shape({ pricing: Yup.number().positive().required() }),
		),
	});

	const onSubmit = async ({ pricing }: { pricing: number }) => {
		const data = await setEntityData("configurations", {
			pricing: `${pricing}`,
		});

		if (data)
			addToast({
				title: "Configuración guardada correctamente",
				color: "success",
			});
	};

	return (
		<section className="flex flex-col items-center justify-center">
			<Card>
				<CardHeader>
					<h1 className="text-xl font-bold">Configuración</h1>
				</CardHeader>
				<CardBody>
					<form
						className="flex flex-col gap-4"
						id="config-form"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<Controller
							name="pricing"
							control={form.control}
							render={({ field, fieldState: { error } }) => (
								<NumberInput
									{...field}
									onValueChange={(value) => field.onChange(value)}
									errorMessage={error?.message}
									isInvalid={!!error}
									label="Precio por mes:"
									description="Ingrese el precio por mes"
								/>
							)}
						/>
					</form>
				</CardBody>
				<CardFooter>
					<Button
						type="submit"
						color="primary"
						form="config-form"
						isLoading={form.formState.isSubmitting}
					>
						Guardar
					</Button>
				</CardFooter>
			</Card>
		</section>
	);
}
