"use client";

import { authClient } from "@/lib/auth-client";
import { authLoginSchema } from "@/utils/interfaces/schemas";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginComponent() {
	const router = useRouter();

	const [isVisible, setIsVisible] = useState(false);

	const form = useForm<{ email: string; password: string }>({
		criteriaMode: "firstError",
		mode: "all",
		defaultValues: {},
		resolver: yupResolver(authLoginSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const onSubmit = async (data: { email: string; password: string }) => {
		const { data: info, error } = await authClient.signIn.email({
			callbackURL: "/",
			email: data.email,
			password: data.password,
		});

		if (error) return toast.error(error.message);
	};

	return (
		<form
			className="flex flex-col h-2/4 w-1/2 p-6 gap-2"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<h1 className="text-2xl font-medium my-2">
				Usuario <p className="text-primary inline-flex">|</p> Iniciar sesion
			</h1>
			{/* EMAIL FIELD */}
			<Controller
				name="email"
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
			<Controller
				name="password"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						type={isVisible ? "text" : "password"}
						{...field}
						label="Contraseña:"
						description="Ingrese su contraseña"
						variant="bordered"
						isInvalid={!!error}
						errorMessage={error?.message}
						className="col-span-2"
						endContent={
							<Button
								onPress={() => setIsVisible(!isVisible)}
								color="default"
								variant="light"
								className="text-default-500"
								isIconOnly
							>
								{isVisible ? <EyeOff /> : <Eye />}
							</Button>
						}
					/>
				)}
			/>

			<Link href="/sesion/registrar" className="text-end">
				¿Desea registrarse?
			</Link>

			<Button fullWidth type="submit" color="primary">
				Ingresar
			</Button>
		</form>
	);
}
