"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
	User,
	Shield,
	Key,
	Eye,
	EyeOff,
	Copy,
	RefreshCw,
	AlertCircle,
	Save,
	AlertCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import type { User as UserI } from "@/utils/interfaces/user";
import { userProfileChange } from "@/utils/interfaces/schemas";
import { updateEntityData } from "@/lib/action-data";
import { toast } from "sonner";

export type UserProfileI = Partial<
	Omit<UserI, "id" | "role" | "image" | "ci_number"> & {
		new_password: string;
	}
>;

export default function ProfileInfo({ data }: { data: UserI }) {
	const [recoveryCode, setRecoveryCode] = useState<string>("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	const form = useForm<UserProfileI>({
		resolver: yupResolver(userProfileChange),
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		form.reset(data);
	}, [data]);

	const onSubmit = async (values: UserProfileI) =>
		await updateEntityData("users", data.id ?? "", {
			...values,
			...(recoveryCode ? { restore_code: recoveryCode } : {}),
		});

	const generateNewRecoveryCode = () =>
		setRecoveryCode(Math.random().toString(36).substring(2, 12).toUpperCase());

	const copyRecoveryCode = () => {
		navigator.clipboard.writeText(recoveryCode);
	};

	return (
		<div className="container mx-auto py-4 px-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Información Personal</h1>
				<p className="text-muted-foreground mt-2">
					Actualiza tu información personal, configuración de seguridad y código
					de recuperación
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((data) =>
						toast.promise(onSubmit(data), {
							loading: "Guardando...",
							success: (data) => {
								return "";
							},
							error: (err: Error) => `Error al guardar datos: ${err.message}`,
						}),
					)}
					className="space-y-8"
				>
					{/* Sección de Información Personal */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="h-5 w-5" />
								Información Personal
							</CardTitle>
							<CardDescription>
								Actualiza tus datos personales y de contacto
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex flex-col md:grid md:grid-cols-2 gap-4 ">
								{/* NAME FIELD */}
								<FormField
									control={form.control}
									name={"name"}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nombres:</FormLabel>
											<FormControl>
												<Input
													placeholder="Ingrese sus Nombres"
													{...field}
													required
												/>
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
													placeholder="pedro123@gmail.com"
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
													type="tel"
												/>
											</FormControl>
											<FormDescription>Ej: 0424...</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
					</Card>

					<div className="flex flex-col md:grid md:grid-cols-2 gap-4 min-h-0">
						{/* Sección de Cambio de Contraseña */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Shield className="h-5 w-5" />
									Cambio de Contraseña
								</CardTitle>
								<CardDescription>
									Actualiza tu contraseña para mantener tu cuenta segura
									(opcional)
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Contraseña Actual</FormLabel>
											<FormControl>
												<div className="relative">
													<Input
														type={showCurrentPassword ? "text" : "password"}
														placeholder="Ingresa tu contraseña actual"
														{...field}
													/>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
														onClick={() =>
															setShowCurrentPassword(!showCurrentPassword)
														}
													>
														{showCurrentPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</Button>
												</div>
											</FormControl>
											<FormDescription>
												Requerida solo si deseas cambiar tu contraseña
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="new_password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nueva Contraseña</FormLabel>
											<FormControl>
												<div className="relative">
													<Input
														type={showNewPassword ? "text" : "password"}
														placeholder="Ingresa tu nueva contraseña"
														{...field}
													/>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
														onClick={() => setShowNewPassword(!showNewPassword)}
													>
														{showNewPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</Button>
												</div>
											</FormControl>
											<FormDescription>
												Mínimo 8 caracteres con mayúsculas, minúsculas y números
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
											<FormLabel>Confirmar Nueva Contraseña</FormLabel>
											<FormControl>
												<div className="relative">
													<Input
														type={showNewPassword ? "text" : "password"}
														placeholder="Confirma tu nueva contraseña"
														{...field}
													/>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
														onClick={() => setShowNewPassword(!showNewPassword)}
													>
														{showNewPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</Button>
												</div>
											</FormControl>
											<FormDescription>
												Debe coincidir con la nueva contraseña
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Alert>
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>
										Solo completa estos campos si deseas cambiar tu contraseña
										actual.
									</AlertDescription>
								</Alert>
							</CardContent>
						</Card>

						{/* Sección de Código de Recuperación */}
						<Card>
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
											onClick={generateNewRecoveryCode}
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
											<li>
												• Guarda este código en un lugar seguro y accesible
											</li>
											<li>• No compartas este código con nadie</li>
										</ul>
									</AlertDescription>
								</Alert>
							</CardContent>
						</Card>
					</div>

					{/* Botones de acción */}
					<div className="flex flex-col sm:flex-row gap-4">
						<Button
							type="submit"
							className="flex items-center gap-2 flex-1 sm:flex-none"
						>
							<Save className="h-4 w-4" />
							Guardar Todos los Cambios
						</Button>
						<Button
							type="button"
							variant="outline"
							className="flex-1 sm:flex-none bg-transparent"
						>
							Cancelar
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
