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
import { authRestorePasswordSchema } from "@/utils/interfaces/schemas";
import { toast } from "sonner";
import { changePassword, setEntityData } from "@/lib/action-data";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import type { ChangePassword } from "@/utils/interfaces/user";

export const RestorePassword = () => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showCode, setShowCode] = useState<boolean>(false);

	const form = useForm<ChangePassword>({
		criteriaMode: "firstError",
		defaultValues: {
			ci_number: "V",
		},
		mode: "all",
		resolver: yupResolver(authRestorePasswordSchema),
	});

	const handleSubmit = async (data: ChangePassword) => {
		try {
			return changePassword(data);
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
						loading: "Procesando...",
						success: (data) => {
							return data;
						},
						error: (error) => error,
					}),
				)}
			>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="text-2xl font-bold">Restaurar contraseña</h1>
						<p className="text-muted-foreground text-sm text-balance">
							Rellena los campos para poder restaurar tu contraseña
						</p>
					</div>
					{/* CI FIELD */}
					<FormField
						control={form.control}
						name="ci_number"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cédula de identidad:</FormLabel>
								<FormControl>
									<div className="flex items-center gap-2 w-full">
										<Select
											onValueChange={(value) =>
												field.onChange(value + (field.value?.slice(1) ?? ""))
											}
											defaultValue={field.value?.charAt(0) ?? "V"}
										>
											<SelectTrigger>
												<SelectValue placeholder="V" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="V">V</SelectItem>
												<SelectItem value="E">E</SelectItem>
											</SelectContent>
										</Select>
										<div className="relative">
											<Input
												placeholder="3..."
												type="tel"
												className="peer pe-9"
												required
												defaultValue={field.value?.slice(1) ?? ""}
												onChange={({ target: { value: number } }) =>
													field.onChange(field.value?.slice(0, 1) + number)
												}
											/>
										</div>
									</div>
								</FormControl>
								<FormDescription>Prefijo: V o E. Ej: V30...</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="restore_code"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Código de recuperación:</FormLabel>
								<div className="relative">
									<FormControl>
										<Input
											{...field}
											placeholder="3..."
											type={showCode ? "text" : "password"}
											className="peer pe-9"
											required
										/>
									</FormControl>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												disabled={!field.value}
												type="button"
												size="icon"
												variant="link"
												aria-label="visualizar codigo de recuperación"
												className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground/80 peer-disabled:opacity-50"
												onClick={() => setShowCode((state) => !state)}
											>
												{showCode ? <Eye /> : <EyeClosed />}
											</Button>
										</TooltipTrigger>
										<TooltipContent>Ver codigo de recuperación</TooltipContent>
									</Tooltip>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contraseña:</FormLabel>
								<div className="relative">
									<FormControl>
										<Input
											{...field}
											placeholder="3..."
											type={showPassword ? "text" : "password"}
											className="peer pe-9"
											required
										/>
									</FormControl>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												disabled={!field.value}
												type="button"
												size="icon"
												variant="link"
												aria-label="visualizar contraseña"
												className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground/80 peer-disabled:opacity-50"
												onClick={() => setShowPassword((state) => !state)}
											>
												{showPassword ? <Eye /> : <EyeClosed />}
											</Button>
										</TooltipTrigger>
										<TooltipContent>Ver contraseña</TooltipContent>
									</Tooltip>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="repeat_password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contraseña:</FormLabel>
								<div className="relative">
									<FormControl>
										<Input
											{...field}
											placeholder="3..."
											type={showPassword ? "text" : "password"}
											className="peer pe-9"
											required
										/>
									</FormControl>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												disabled={!field.value}
												type="button"
												size="icon"
												variant="link"
												aria-label="visualizar contraseña"
												className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground/80 peer-disabled:opacity-50"
												onClick={() => setShowPassword((state) => !state)}
											>
												{showPassword ? <Eye /> : <EyeClosed />}
											</Button>
										</TooltipTrigger>
										<TooltipContent>Ver contraseña</TooltipContent>
									</Tooltip>
								</div>
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
