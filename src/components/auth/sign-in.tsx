"use client";

import { authClient } from "@/lib/auth-client";
import { authLoginSchema } from "@/utils/interfaces/schemas";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { Link } from "@heroui/link";
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

		if (info) return toast.success("Inicio de sesión exitoso");

		return toast.error(error.message ?? "Error al iniciar sesión");
	};

	return (
		<form
			id="login-form"
			className="flex flex-col p-2 gap-2 self-center h-full justify-around"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<div className="flex flex-row justify-center items-center">
				<Image
					src="/trapiche.svg"
					alt="Trapichito"
					width={80}
					height={80}
					className="self-center"
				/>
				<h1 className="text-2xl font-medium text-pretty">
					Escuela de Baloncesto Formativa “El Trapichito”
				</h1>
			</div>
			<h2 className="text-xl font-normal text-center">
				¡Bienvenido! 👋🏻 <p className="text-primary inline-flex">|</p> Inicia
				sesión
			</h2>
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
			<div className="flex flex-col gap-2">
				<Link
					className="w-full text-right"
					href="/sesion/recuperar"
					as={NextLink}
				>
					Olvide mi contraseña
				</Link>

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
			</div>
			<Button
				fullWidth
				type="submit"
				color="primary"
				form="login-form"
				isLoading={form.formState.isSubmitting}
			>
				Ingresar
			</Button>
		</form>
	);
}
