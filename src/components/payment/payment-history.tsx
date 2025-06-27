import { Calendar, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { useState } from "react";
import { Badge } from "../ui/badge";

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

export default function InvoicesHistory() {
	const [busquedaHistorial, setBusquedaHistorial] = useState("");

	// Filtrar historial de pagos según la búsqueda
	const historialFiltrado = historialPagos.filter(
		(pago) =>
			pago.estudiante.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
			pago.concepto.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
			pago.id.toLowerCase().includes(busquedaHistorial.toLowerCase()),
	);

	return (
		<section>
			<h1>Historial de Pagos</h1>
			<p>Consulta los pagos realizados anteriormente</p>

			<div className="py-4">
				<div className="relative mb-4">
					<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Buscar por estudiante, concepto o ID de pago..."
						className="pl-10"
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
										<TableCell className="font-medium">{pago.id}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-gray-400" />
												{new Date(pago.fecha).toLocaleDateString("es-ES")}
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
		</section>
	);
}
