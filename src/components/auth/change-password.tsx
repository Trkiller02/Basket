"use client";

import { changePassword } from "@/lib/action-data";
import { changePasswordSchema } from "@/utils/interfaces/schemas";
import type { ChangePasswod } from "@/utils/interfaces/user";
import { Button, ButtonGroup } from "@heroui/button";
import { Input } from "@heroui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ChangePassword() {
	const [isVisible, setIsVisible] = useState(false);

	const form = useForm<ChangePasswod>({
		resolver: yupResolver(changePasswordSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const onSubmit = async (data: ChangePasswod) => {
		if (data.new_password !== data.repeat_password) {
			return toast.error("Las contraseñas no coinciden");
		}

		return toast.promise(changePassword(data), {
			success: "Contraseña cambiada con éxito",
			error: "Error al cambiar la contraseña",
			loading: "Cambiando contraseña...",
		});
	};

	return (
		<form
			className="flex flex-col gap-3 w-1/2 border-content2 bg-content1 p-4 rounded-xl shadow-md"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<Controller
				name="ci_number"
				control={form.control}
				render={({ field, fieldState: { error } }) => (
					<Input
						{...field}
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
				<Button color="primary">Cambiar contraseña</Button>
				<Button color="secondary" variant="flat">
					Cancelar
				</Button>
			</ButtonGroup>
		</form>
	);
}
