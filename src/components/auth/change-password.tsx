"use client";

import { changePassword } from "@/lib/action-data";
import { changePasswordSchema } from "@/utils/interfaces/schemas";
import type { ChangePasswod } from "@/utils/interfaces/user";
import { Button, ButtonGroup } from "@heroui/button";
import { Input } from "@heroui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ChangePassword() {
	const [isVisible, setIsVisible] = useState(false);
	const router = useRouter();

	const form = useForm<ChangePasswod>({
		mode: "all",
		criteriaMode: "firstError",
		resolver: yupResolver(changePasswordSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const onSubmit = async (data: ChangePasswod) => {
		return changePassword(data);
	};

	return (
		<form
			className="flex flex-col p-2 gap-2 self-center h-full justify-around"
			onSubmit={form.handleSubmit((values) =>
				toast.promise(onSubmit(values), {
					success: (data) => {
						router.push("/sesion/iniciar");
						return data;
					},
					error: (err: Error) => err.message,
					loading: "Cambiando contraseña...",
				}),
			)}
		>
			<h2 className="text-2xl font-medium text-center">Recuperar contraseña</h2>
			<Controller
				name="ci_number"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
						isRequired
						color={error ? "danger" : "default"}
						label="Cédula de identidad:"
						placeholder="V30..."
						description="Ej: V30349189"
						isInvalid={!!error}
						errorMessage={error?.message}
					/>
				)}
			/>
			<Controller
				name="restore_code"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						isRequired
						type={isVisible ? "text" : "password"}
						{...field}
						label="Código de restauración:"
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
			<Controller
				name="new_password"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						isRequired
						type={isVisible ? "text" : "password"}
						{...field}
						label="Nueva contraseña:"
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
			<Controller
				name="repeat_password"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						type={isVisible ? "text" : "password"}
						{...field}
						label="Repetir contraseña:"
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

			<ButtonGroup className="mt-4 self-end">
				<Button color="primary" type="submit">
					Cambiar contraseña
				</Button>
				<Button color="secondary" variant="flat" onPress={() => router.back()}>
					Cancelar
				</Button>
			</ButtonGroup>
		</form>
	);
}
