"use client";

import {
	AlertCircleIcon,
	Copy,
	Eye,
	EyeOff,
	Key,
	RefreshCw,
	Save,
	Search,
} from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { setUpper } from "@/utils/setUpper";
import { toast } from "sonner";
import { findEntity } from "@/utils/getEntity";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import type { User } from "@/utils/interfaces/user";
import { userSchema } from "@/utils/interfaces/schemas";
import { fetchData } from "@/utils/fetchHandler";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MainDialog } from "../details/main-dialog";
import { QRDetails } from "../details/qr-code";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function UserForm() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [data, setData] = useState<{
		name: string;
		password: string;
		restore_code: string;
	}>();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		if (!data) return;

		const params = new URLSearchParams(searchParams);

		params.append("modal", "true");

		router.push(`${pathname}?${params.toString()}`);
	}, [data]);

	const [recoveryCode, setRecoveryCode] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [occupation, setOccupation] = useState<string>("");

	const form = useForm<Omit<User, "id">>({
		defaultValues: {
			ci_number: "V",
			role: "representante",
		},
		resolver: yupResolver(userSchema),
	});

	const onSubmit = async (data: Omit<User, "id">) => {
		const response = await fetchData<{ message: string }>(
			`/api/${data.role === "representante" ? "representatives" : "users"}`,
			{
				method: "POST",
				body: setUpper(
					data.role === "representante" ? { user_id: data, occupation } : data,
				),
			},
		);

		setData({
			name: data.name,
			password: data.password ?? "",
			restore_code: recoveryCode,
		});

		return response;
	};

	const generateRecoveryCode = () => {
		const generatedCode = Math.random()
			.toString(36)
			.substring(2, 12)
			.toUpperCase();

		setRecoveryCode(generatedCode);
		form.setValue("restore_code", generatedCode);
	};

	const copyRecoveryCode = () => {
		navigator.clipboard.writeText(recoveryCode);
	};

	return (
		<Form {...form}>
			<form
				className="flex flex-col md:grid grid-cols-2 gap-3 w-full"
				onSubmit={form.handleSubmit((data) =>
					toast.promise(onSubmit(data), {
						loading: "Guardando...",
						success: (data) => data?.message ?? "Datos guardados",
						error: (error) => error.message,
					}),
				)}
				onReset={() => form.reset()}
				id={`user-form`}
			>
				<h3 className="col-span-2 font-semibold text-lg">Datos personales:</h3>
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
										required
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
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													disabled={!field.value}
													type="button"
													size="icon"
													variant="link"
													aria-label="Buscar entidad"
													className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground/80 peer-disabled:opacity-50"
													onClick={() =>
														toast.promise(findEntity(field.value), {
															loading: "Verificando si existe...",
															success: "Registro encontrado",
															error: (error) =>
																error instanceof Error ? error.message : error,
														})
													}
												>
													<Search />
												</Button>
											</TooltipTrigger>
											<TooltipContent>Buscar registro</TooltipContent>
										</Tooltip>
									</div>
								</div>
							</FormControl>
							<FormDescription>Prefijo: V o E. Ej: V30...</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* ROLE FIELD */}
				<FormField
					control={form.control}
					name={"role"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Rol:</FormLabel>
							<FormControl>
								<Select
									{...field}
									required
									defaultValue={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger>
										<SelectValue placeholder="Seleccione un rol" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="representante">Representante</SelectItem>
										<SelectItem value="secretaria">Secretaria</SelectItem>
										<SelectItem value="administrador">Administrador</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormDescription>Elija el rol que desea asignar</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* NAME FIELD */}
				<FormField
					control={form.control}
					name={"name"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombres:</FormLabel>
							<FormControl>
								<Input placeholder="Ingrese sus Nombres" {...field} required />
							</FormControl>
							<FormDescription>Ej: Maria Jose</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* LASTNAME FIELD */}
				<FormField
					control={form.control}
					name={"lastname"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Apellidos:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ingrese sus Apellidos"
									{...field}
									required
								/>
							</FormControl>
							<FormDescription>Ej: Perez Marquez</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* EMAIL FIELD */}
				<FormField
					control={form.control}
					name={"email"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Correo electrónico:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ej: pedro123@gmail.com"
									{...field}
									required
									type="email"
								/>
							</FormControl>
							<FormDescription>Ej: pedro123@gmail.com</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* PHONE_NUMBER FIELD */}
				<FormField
					control={form.control}
					name={"phone_number"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Número telefónico:</FormLabel>
							<FormControl>
								<Input
									placeholder="Ingrese su numero telefonico"
									{...field}
									required
									type="tel"
								/>
							</FormControl>
							<FormDescription>Ej: 0424...</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{form.watch("role") === "representante" && (
					<>
						{/* OCCUPATION FIELD */}
						<FormField
							name="occupation"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ocupación:</FormLabel>
									<FormControl>
										<Input
											placeholder="Ej: Secretaria"
											{...field}
											required
											onChange={({ target: { value } }) => setOccupation(value)}
										/>
									</FormControl>
									<FormDescription>Ej: Maria Jose</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<br />
					</>
				)}

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contraseña</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										type={showPassword ? "text" : "password"}
										placeholder="Ingresa tu contraseña actual"
										{...field}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</FormControl>

							<FormDescription>
								Crea una contraseña segura y difícil de adivinar
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="repeat_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirmar Contraseña</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										type={showPassword ? "text" : "password"}
										placeholder="Confirma tu nueva contraseña"
										{...field}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</FormControl>
							<FormDescription>
								Debe coincidir con la contraseña
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Key className="h-5 w-5" />
							Código de Recuperación
						</CardTitle>
						<CardDescription>
							Gestiona tu código de recuperación para acceso de emergencia
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<Alert>
							<Key className="h-4 w-4" />
							<AlertDescription>
								Este código te permite recuperar el acceso a tu cuenta si
								olvidas tu contraseña. Guárdalo en un lugar seguro.
							</AlertDescription>
						</Alert>

						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Código de Recuperación Actual</Label>
								<div className="flex items-center space-x-2">
									<Input
										value={recoveryCode}
										readOnly
										className="font-mono text-center text-lg tracking-wider bg-muted"
									/>
									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={copyRecoveryCode}
										title="Copiar código"
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
								<p className="text-sm text-muted-foreground">
									Copia este código y guárdalo en un lugar seguro
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={generateRecoveryCode}
									className="flex items-center gap-2 bg-transparent"
								>
									<RefreshCw className="h-4 w-4" />
									Generar Nuevo Código
								</Button>
								<Button type="button" variant="secondary">
									Descargar Código
								</Button>
							</div>
						</div>

						<Alert>
							<AlertCircleIcon />
							<AlertTitle>Instrucciones Importantes:</AlertTitle>
							<AlertDescription>
								<ul className="space-y-1 text-sm text-muted-foreground">
									<li>• Guarda este código en un lugar seguro y accesible</li>
									<li>• No compartas este código con nadie</li>
								</ul>
							</AlertDescription>
						</Alert>
					</CardContent>
				</Card>
				<div className="col-span-2 inline-flex items-center gap-4">
					<Button variant="outline" asChild>
						<Link href="/">Cancelar</Link>
					</Button>

					<Button type="submit" className="flex items-center space-x-2">
						<Save className="h-4 w-4" />
						<span>Guardar</span>
					</Button>
				</div>
				<MainDialog
					onAction={() => {
						router.push("/");
					}}
				>
					<QRDetails data={data} />
				</MainDialog>
			</form>
		</Form>
	);
}
