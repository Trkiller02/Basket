"use client";

import type React from "react";

import { useState } from "react";
import {
	Upload,
	User,
	DollarSign,
	FileText,
	Check,
	History,
	Calendar,
	Search,
	X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

// Monto fijo definido por la empresa
const MONTO_MENSUALIDAD = 175.0;

// Datos de ejemplo de estudiantes (sin monto individual)
const estudiantes = [
	{ id: "1", nombre: "María González", curso: "Matemáticas Avanzadas" },
	{ id: "2", nombre: "Carlos Rodríguez", curso: "Física Cuántica" },
	{ id: "3", nombre: "Ana Martínez", curso: "Química Orgánica" },
	{ id: "4", nombre: "Luis Fernández", curso: "Biología Molecular" },
];

// Datos de ejemplo para el historial de pagos
const historialPagos = [
	{
		id: "PAG-001",
		fecha: "2025-05-10",
		estudiante: "María González",
		monto: 175.0,
		concepto: "Mensualidad Mayo 2025 - Matemáticas Avanzadas",
		comprobante: "comprobante-001.jpg",
		estado: "completado",
	},
	{
		id: "PAG-002",
		fecha: "2025-04-05",
		estudiante: "María González, Carlos Rodríguez",
		monto: 350.0,
		concepto: "Mensualidad Abril 2025 - Múltiples estudiantes",
		comprobante: "comprobante-002.jpg",
		estado: "completado",
	},
	{
		id: "PAG-003",
		fecha: "2025-05-08",
		estudiante: "Carlos Rodríguez",
		monto: 175.0,
		concepto: "Mensualidad Mayo 2025 - Física Cuántica",
		comprobante: "comprobante-003.jpg",
		estado: "completado",
	},
	{
		id: "PAG-004",
		fecha: "2025-03-15",
		estudiante: "Ana Martínez, Luis Fernández",
		monto: 350.0,
		concepto: "Mensualidad Marzo 2025 - Múltiples estudiantes",
		comprobante: "comprobante-004.jpg",
		estado: "completado",
	},
];

export default function Component() {
	const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState<
		string[]
	>([]);
	const [comprobante, setComprobante] = useState<File | null>(null);
	const [concepto, setConcepto] = useState("");
	const [procesando, setProcesando] = useState(false);
	const [busquedaHistorial, setBusquedaHistorial] = useState("");

	const handleEstudianteToggle = (estudianteId: string) => {
		setEstudiantesSeleccionados((prev) => {
			const nuevaSeleccion = prev.includes(estudianteId)
				? prev.filter((id) => id !== estudianteId)
				: [...prev, estudianteId];

			// Actualizar concepto automáticamente
			if (nuevaSeleccion.length > 0) {
				const estudiantesInfo = nuevaSeleccion
					.map((id) => estudiantes.find((e) => e.id === id))
					.filter(Boolean);
				const fechaActual = new Date().toLocaleDateString("es-ES", {
					month: "long",
					year: "numeric",
				});

				if (nuevaSeleccion.length === 1) {
					setConcepto(
						`Mensualidad ${fechaActual} - ${estudiantesInfo[0]?.curso}`,
					);
				} else {
					setConcepto(`Mensualidad ${fechaActual} - Múltiples estudiantes`);
				}
			} else {
				setConcepto("");
			}

			return nuevaSeleccion;
		});
	};

	const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setComprobante(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setProcesando(true);

		// Simular procesamiento
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setProcesando(false);
		alert("Pago registrado exitosamente");
	};

	const estudiantesInfo = estudiantesSeleccionados
		.map((id) => estudiantes.find((e) => e.id === id))
		.filter(Boolean);

	const montoTotal = estudiantesSeleccionados.length * MONTO_MENSUALIDAD;

	// Filtrar historial de pagos según la búsqueda
	const historialFiltrado = historialPagos.filter(
		(pago) =>
			pago.estudiante.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
			pago.concepto.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
			pago.id.toLowerCase().includes(busquedaHistorial.toLowerCase()),
	);

	const removerEstudiante = (estudianteId: string) => {
		handleEstudianteToggle(estudianteId);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mx-auto max-w-2xl">
				<div className="mb-6 flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Pago de Mensualidad
						</h1>
						<p className="text-gray-600">
							Registra el pago de mensualidad para tus estudiantes
						</p>
					</div>

					{/* Botón para ver historial de pagos */}
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" className="flex items-center gap-2">
								<History className="h-4 w-4" />
								Historial de Pagos
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[800px]">
							<DialogHeader>
								<DialogTitle>Historial de Pagos</DialogTitle>
								<DialogDescription>
									Consulta los pagos realizados anteriormente
								</DialogDescription>
							</DialogHeader>

							<div className="py-4">
								<div className="relative mb-4">
									<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Buscar por estudiante, concepto o ID de pago..."
										className="pl-10"
										value={busquedaHistorial}
										onChange={(e) => setBusquedaHistorial(e.target.value)}
									/>
								</div>

								<div className="rounded-md border overflow-hidden">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="w-[100px]">ID</TableHead>
												<TableHead>Fecha</TableHead>
												<TableHead>Estudiante(s)</TableHead>
												<TableHead>Concepto</TableHead>
												<TableHead className="text-right">Monto</TableHead>
												<TableHead>Estado</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{historialFiltrado.length > 0 ? (
												historialFiltrado.map((pago) => (
													<TableRow key={pago.id}>
														<TableCell className="font-medium">
															{pago.id}
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<Calendar className="h-4 w-4 text-gray-400" />
																{new Date(pago.fecha).toLocaleDateString(
																	"es-ES",
																)}
															</div>
														</TableCell>
														<TableCell>{pago.estudiante}</TableCell>
														<TableCell className="max-w-[200px] truncate">
															{pago.concepto}
														</TableCell>
														<TableCell className="text-right font-medium">
															${pago.monto.toFixed(2)}
														</TableCell>
														<TableCell>
															<Badge
																variant="outline"
																className="bg-green-50 text-green-700 border-green-200"
															>
																{pago.estado === "completado"
																	? "Completado"
																	: "Pendiente"}
															</Badge>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell colSpan={6} className="h-24 text-center">
														No se encontraron pagos
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				{/* Monto Total - Dinámico según estudiantes seleccionados */}
				<Card className="bg-gradient-to-r from-primary to-green-600 text-white mb-6">
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-green-100 text-sm font-medium mb-1">
								MONTO TOTAL A CANCELAR
							</p>
							<p className="text-4xl font-bold mb-2">
								${montoTotal.toFixed(2)}
							</p>
							<p className="text-green-100 text-sm">
								{estudiantesSeleccionados.length > 0
									? `${estudiantesSeleccionados.length} estudiante${estudiantesSeleccionados.length > 1 ? "s" : ""} × $${MONTO_MENSUALIDAD.toFixed(2)}`
									: `$${MONTO_MENSUALIDAD.toFixed(2)} por estudiante`}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<DollarSign className="h-5 w-5" />
							Información del Pago
						</CardTitle>
						<CardDescription>
							Completa los datos del pago de mensualidad
						</CardDescription>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className="space-y-6">
							{/* Selección de Estudiantes */}
							<div className="space-y-2">
								<Label>Estudiantes</Label>
								<Card className="p-4">
									<div className="space-y-3">
										{estudiantes.map((estudiante) => (
											<div
												key={estudiante.id}
												className="flex items-center space-x-3"
											>
												<Checkbox
													id={estudiante.id}
													checked={estudiantesSeleccionados.includes(
														estudiante.id,
													)}
													onCheckedChange={() =>
														handleEstudianteToggle(estudiante.id)
													}
												/>
												<label
													htmlFor={estudiante.id}
													className="flex-1 flex items-center gap-2 cursor-pointer"
												>
													<User className="h-4 w-4" />
													<div>
														<div className="font-medium">
															{estudiante.nombre}
														</div>
														<div className="text-sm text-gray-500">
															{estudiante.curso}
														</div>
													</div>
												</label>
											</div>
										))}
									</div>
								</Card>
							</div>

							{/* Estudiantes Seleccionados */}
							{estudiantesInfo.length > 0 && (
								<Card className="bg-blue-50 border-blue-200">
									<CardHeader className="pb-3">
										<CardTitle className="text-sm text-blue-800">
											Estudiantes Seleccionados
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="flex flex-wrap gap-2">
											{estudiantesInfo.map((estudiante) => (
												<Badge
													key={estudiante?.id}
													variant="secondary"
													className="bg-blue-100 text-blue-800 flex items-center gap-1"
												>
													{estudiante?.nombre}
													<button
														type="button"
														onClick={() =>
															removerEstudiante(estudiante?.id ?? "")
														}
														className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
													>
														<X className="h-3 w-3" />
													</button>
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							)}

							<Separator />

							{/* Concepto */}
							<div className="space-y-2">
								<Label htmlFor="concepto">Concepto</Label>
								<Textarea
									id="concepto"
									value={concepto}
									onChange={(e) => setConcepto(e.target.value)}
									placeholder="Describe el concepto del pago"
									className="min-h-[80px]"
									required
								/>
							</div>

							{/* Comprobante de Pago */}
							<div className="space-y-2">
								<Label htmlFor="comprobante">Comprobante de Pago</Label>
								<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
									<input
										id="comprobante"
										type="file"
										accept="image/*,.pdf"
										onChange={handleComprobanteChange}
										className="hidden"
									/>
									<label htmlFor="comprobante" className="cursor-pointer">
										<Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
										<p className="text-sm text-gray-600">
											{comprobante ? (
												<span className="flex items-center justify-center gap-2 text-green-600">
													<Check className="h-4 w-4" />
													{comprobante.name}
												</span>
											) : (
												<>
													Haz clic para subir tu comprobante de pago
													<br />
													<span className="text-xs text-gray-400">
														PNG, JPG, PDF hasta 10MB
													</span>
												</>
											)}
										</p>
									</label>
								</div>
							</div>

							{/* Resumen */}
							<Card className="bg-green-50 border-green-200">
								<CardHeader className="pb-3">
									<CardTitle className="text-lg text-green-800 flex items-center gap-2">
										<FileText className="h-5 w-5" />
										Resumen del Pago
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex justify-between">
										<span className="text-green-700">Estudiantes:</span>
										<span className="font-medium text-green-900">
											{estudiantesInfo.length > 0
												? `${estudiantesInfo.length} seleccionado${estudiantesInfo.length > 1 ? "s" : ""}`
												: "Ninguno seleccionado"}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-green-700">
											Monto por estudiante:
										</span>
										<span className="font-medium text-green-900">
											${MONTO_MENSUALIDAD.toFixed(2)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-green-700">Monto Total:</span>
										<span className="font-bold text-green-900">
											${montoTotal.toFixed(2)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-green-700">Comprobante:</span>
										<span className="text-green-900">
											{comprobante ? "Adjuntado" : "Pendiente"}
										</span>
									</div>
								</CardContent>
							</Card>
						</CardContent>

						<CardFooter className="flex gap-3">
							<Button type="button" variant="outline" className="flex-1">
								Cancelar
							</Button>
							<Button
								type="submit"
								className="flex-1"
								disabled={
									estudiantesSeleccionados.length === 0 ||
									!comprobante ||
									procesando
								}
							>
								{procesando ? "Procesando..." : "Registrar Pago"}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}
