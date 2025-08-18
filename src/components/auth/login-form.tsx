"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { authLoginSchema } from "@/utils/interfaces/schemas";
import { signIn } from "next-auth/react";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const form = useForm({
		criteriaMode: "firstError",
		shouldUseNativeValidation: true,
		defaultValues: {
			query: "V",
			password: "",
		},
		resolver: yupResolver(authLoginSchema),
	});

	return (
		<Form {...form}>
			<form
				className={cn("flex flex-col gap-6", className)}
				{...props}
				onSubmit={form.handleSubmit((values) =>
					signIn("credentials", {
						...values,
						redirect: true,
						redirectTo: "/sesion/validar",
					}),
				)}
			>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">Iniciar sesión</h1>
					<p className="text-muted-foreground text-sm text-balance">
						Ingrese su Cedula de Identidad a continuación para iniciar sesión en
						su cuenta
					</p>
				</div>
				<div className="grid gap-6">
					{/* CI FIELD */}
					<FormField
						control={form.control}
						name="query"
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
								</FormControl>
								<FormDescription>Prefijo: V o E. Ej: V30...</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid gap-3">
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
						<div className="flex items-center">
							<a
								href="/sesion/recuperar"
								className="ml-auto text-sm underline-offset-4 hover:underline"
							>
								¿Olvido su contraseña?
							</a>
						</div>
					</div>
					<Button type="submit" className="w-full">
						Ingresar
					</Button>
				</div>
				<div className="text-center text-sm">
					¿No tienes una cuenta? <br />
					<a
						href={`mailto:${process.env.EMAIL_COMPANY}`}
						className="underline underline-offset-4"
					>
						Ponte en contacto con nosotros
					</a>
				</div>
			</form>
		</Form>
	);
}
