"use client";

import { useForm } from "react-hook-form";
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
import { Button } from "../ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { setUpper } from "@/utils/setUpper";
import { representativeSchema } from "@/utils/interfaces/schemas";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { fetchData } from "@/utils/fetchHandler";

export const FillEntity = () => {
	const { data: session } = useSession();

	const form = useForm({
		criteriaMode: "firstError",
		mode: "all",
		resolver: yupResolver(representativeSchema.pick(["occupation", "height"])),
	});

	const handleSubmit = async (data: {
		occupation: string;
		height?: number;
	}) => {
		try {
			const response = await fetchData<{ message: string }>(
				"/api/representatives",
				{
					method: "POST",
					body: setUpper({
						...data,
						user_id: session?.user?.id ?? "",
					}),
				},
			);

			if (response) return "Se ha registrado correctamente";
		} catch (error) {
			throw new Error("Error al registrar", {
				cause: (error as Error).message,
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((values) =>
					toast.promise(handleSubmit(values), {
						loading: "Completando...",
						success: (data) => {
							return data;
						},
						error: (error) => error,
					}),
				)}
			>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="text-2xl font-bold">Completar datos</h1>
						<p className="text-muted-foreground text-sm text-balance">
							Completa tus datos para poder continuar
						</p>
					</div>
					{/* OCCUPATION FIELD */}
					<FormField
						control={form.control}
						name="occupation"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ocupación:</FormLabel>
								<FormControl>
									<Input placeholder="Ingrese su ocupación" {...field} />
								</FormControl>
								<FormDescription>¿En qué ocupación trabaja?</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* HEIGHT FIELD */}
					<FormField
						control={form.control}
						name="height"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estatura:</FormLabel>
								<FormControl>
									<Input {...field} type="number" min={100} max={300} />
								</FormControl>
								<FormDescription>Ingrese su estatura</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* SUBMIT BUTTON */}
					<Button type="submit">Completar</Button>
				</div>
			</form>
		</Form>
	);
};
