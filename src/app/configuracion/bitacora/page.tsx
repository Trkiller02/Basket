"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	CalendarIcon,
	Download,
	Filter,
	RefreshCw,
	Search,
	User,
	Plus,
	Edit,
	Trash2,
	CreditCard,
	LogIn,
	LogOut,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Activity,
	Eye,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";
import type { SystemLog } from "@/utils/interfaces/history";

const actions: Array<{ value: SystemLog["action"] | "all"; label: string }> = [
	{ value: "all", label: "Todas las acciones" },
	{ value: "CREO", label: "Creación" },
	{ value: "MODIFICO", label: "Modificación" },
	{ value: "ELIMINO", label: "Eliminación" },
	{ value: "PAGO", label: "Pago" },
	{ value: "INICIO SESION", label: "Inicio de Sesión" },
	{ value: "CERRO SESION", label: "Cierre de Sesión" },
];

function getActionIcon(action: string) {
	switch (action) {
		case "CREO":
			return <Plus className="h-4 w-4" />;
		case "MODIFICO":
			return <Edit className="h-4 w-4" />;
		case "ELIMINO":
			return <Trash2 className="h-4 w-4" />;
		case "PAGO":
			return <CreditCard className="h-4 w-4" />;
		case "INICIO SESION":
			return <LogIn className="h-4 w-4" />;
		case "CERRO SESION":
			return <LogOut className="h-4 w-4" />;
		default:
			return <Activity className="h-4 w-4" />;
	}
}

function getActionColor(action: string) {
	switch (action) {
		case "CREO":
			return "bg-green-100 text-green-800 border-green-200";
		case "MODIFICO":
			return "bg-blue-100 text-blue-800 border-blue-200";
		case "ELIMINO":
			return "bg-red-100 text-red-800 border-red-200";
		case "PAGO":
			return "bg-purple-100 text-purple-800 border-purple-200";
		case "INICIO SESION":
			return "bg-emerald-100 text-emerald-800 border-emerald-200";
		case "CERRO SESION":
			return "bg-gray-100 text-gray-800 border-gray-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
}

function formatDateTime(dateString: string | null) {
	if (!dateString) return "N/A";
	try {
		return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
	} catch {
		return dateString;
	}
}

export default function Component() {
	const [globalFilter, setGlobalFilter] = useState("");
	const [selectedAction, setSelectedAction] = useState<
		SystemLog["action"] | "all"
	>("all");
	const [dateFrom, setDateFrom] = useState<Date>();
	const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [dialogOpen, setDialogOpen] = useState(false);

	const apiUrl = useMemo(() => {
		const params = new URLSearchParams();

		if (globalFilter) {
			params.append("q", globalFilter);
		}

		if (selectedAction !== "all") {
			params.append("action", selectedAction);
		}

		if (dateFrom) {
			params.append("q", format(dateFrom, "yyyy-MM-dd"));
		}

		params.append("p", currentPage.toString());
		params.append("l", pageSize.toString());

		return `/api/history?${params.toString()}`;
	}, [globalFilter, selectedAction, dateFrom, currentPage, pageSize]);

	const { data: systemLogs, isLoading } = useSWR<{
		result: SystemLog[];
		page: number;
		limit: number;
		total: number;
	}>(apiUrl, fetcher);

	const displayData = systemLogs?.result || [];

	const totalPages = Math.ceil((systemLogs?.total || 0) / pageSize);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
		setCurrentPage(0);
	};

	const handleExport = () => {
		// For export, we'll use the current filtered data
		const csvContent = [
			["ID", "Fecha y Hora", "Usuario", "Acción", "Descripción", "Referencia"],
			...displayData.map((log) => [
				log.id,
				formatDateTime(log.created_at),
				log.user_id,
				log.action,
				log.description || "",
				log.reference_id || "",
			]),
		]
			.map((row) => row.join(","))
			.join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `bitacora-sistema-${format(new Date(), "yyyy-MM-dd")}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	const handleViewDetails = (log: SystemLog) => {
		setSelectedLog(log);
		setDialogOpen(true);
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Bitácora del Sistema</h1>
					<p className="text-muted-foreground">
						Registro de actividades y acciones de usuarios en el sistema
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => window.location.reload()}>
						<RefreshCw className="h-4 w-4 mr-2" />
						Actualizar
					</Button>
					<Button onClick={handleExport}>
						<Download className="h-4 w-4 mr-2" />
						Exportar
					</Button>
				</div>
			</div>

			{/* Filtros */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Filtros de Búsqueda
					</CardTitle>
					<CardDescription>
						Filtra las actividades por diferentes criterios para encontrar
						información específica
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label htmlFor="search">Buscar</Label>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="search"
									placeholder="Buscar en todos los campos..."
									value={globalFilter ?? ""}
									onChange={(e) => setGlobalFilter(e.target.value)}
									className="pl-8"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label>Tipo de Acción</Label>
							<Select
								value={selectedAction}
								onValueChange={(values: string) =>
									setSelectedAction(values as SystemLog["action"] | "all")
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{actions.map((action) => (
										<SelectItem key={action.value} value={action.value}>
											{action.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Fecha</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-start text-left font-normal bg-transparent"
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{dateFrom
											? format(dateFrom, "PPP", { locale: es })
											: "Seleccionar fecha"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={dateFrom}
										onSelect={setDateFrom}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Registro de Actividades</CardTitle>
					<CardDescription>
						Mostrando {displayData.length} actividades de{" "}
						{systemLogs?.total || 0} totales
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="font-semibold">Fecha y Hora</TableHead>
									<TableHead className="font-semibold">Acción</TableHead>
									<TableHead className="font-semibold">Usuario</TableHead>
									<TableHead className="font-semibold">Referencia</TableHead>
									<TableHead>Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow className="hover:bg-transparent">
										<TableCell colSpan={5} className="h-24 text-center">
											Cargando...
										</TableCell>
									</TableRow>
								) : displayData.length ? (
									displayData.map((log) => (
										<TableRow key={log.id}>
											<TableCell>
												<div className="font-mono text-sm">
													{formatDateTime(log.created_at)}
												</div>
											</TableCell>
											<TableCell>
												<Badge
													className={`${getActionColor(log.action)} flex items-center gap-1 w-fit`}
												>
													{getActionIcon(log.action)}
													{log.action}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<User className="h-4 w-4 text-muted-foreground" />
													{log.user_id}
												</div>
											</TableCell>
											<TableCell>
												<div className="font-mono text-sm text-muted-foreground">
													{log.reference_id || "N/A"}
												</div>
											</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleViewDetails(log)}
													className="h-8 w-8 p-0"
												>
													<Eye className="h-4 w-4" />
													<span className="sr-only">Ver detalles</span>
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={5} className="h-24 text-center">
											No se encontraron actividades.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					<div className="flex items-center justify-between space-x-2 py-4">
						<div className="flex items-center space-x-2">
							<p className="text-sm font-medium">Filas por página</p>
							<Select
								value={`${pageSize}`}
								onValueChange={(value) => handlePageSizeChange(Number(value))}
							>
								<SelectTrigger className="h-8 w-[70px]">
									<SelectValue placeholder={pageSize} />
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((size) => (
										<SelectItem key={size} value={`${size}`}>
											{size}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-6 lg:space-x-8">
							<div className="flex w-[100px] items-center justify-center text-sm font-medium">
								Página {currentPage + 1} de {totalPages || 1}
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
									onClick={() => handlePageChange(0)}
									disabled={currentPage === 0}
								>
									<span className="sr-only">Ir a la primera página</span>
									<ChevronsLeft className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									className="h-8 w-8 p-0 bg-transparent"
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 0}
								>
									<span className="sr-only">Ir a la página anterior</span>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									className="h-8 w-8 p-0 bg-transparent"
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage >= totalPages - 1}
								>
									<span className="sr-only">Ir a la página siguiente</span>
									<ChevronRight className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
									onClick={() => handlePageChange(totalPages - 1)}
									disabled={currentPage >= totalPages - 1}
								>
									<span className="sr-only">Ir a la última página</span>
									<ChevronsRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Modal de detalles */}
			{selectedLog && (
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Detalles de la Actividad</DialogTitle>
							<DialogDescription>
								Información completa del registro de actividad del sistema
							</DialogDescription>
						</DialogHeader>
						<div className="mt-4 space-y-6">
							{/* Información básica */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-sm font-medium text-muted-foreground">
										ID del Registro
									</Label>
									<div className="font-mono text-sm bg-muted p-2 rounded">
										{selectedLog.id}
									</div>
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium text-muted-foreground">
										Fecha y Hora
									</Label>
									<div className="font-mono text-sm bg-muted p-2 rounded">
										{formatDateTime(selectedLog.created_at)}
									</div>
								</div>
							</div>

							{/* Acción y Usuario */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-sm font-medium text-muted-foreground">
										Tipo de Acción
									</Label>
									<div className="flex items-center gap-2">
										<Badge
											className={`${getActionColor(selectedLog.action)} flex items-center gap-1 w-fit`}
										>
											{getActionIcon(selectedLog.action)}
											{selectedLog.action}
										</Badge>
									</div>
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium text-muted-foreground">
										Usuario
									</Label>
									<div className="flex items-center gap-2 bg-muted p-2 rounded">
										<User className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{selectedLog.user_id}</span>
									</div>
								</div>
							</div>

							{/* Referencia */}
							{selectedLog.reference_id && (
								<div className="space-y-2">
									<Label className="text-sm font-medium text-muted-foreground">
										ID de Referencia
									</Label>
									<div className="font-mono text-sm bg-muted p-2 rounded">
										{selectedLog.reference_id}
									</div>
								</div>
							)}

							{/* Descripción */}
							<div className="space-y-2">
								<Label className="text-sm font-medium text-muted-foreground">
									Descripción
								</Label>
								<div className="bg-muted p-4 rounded-lg min-h-[100px]">
									{selectedLog.description ? (
										<p className="text-sm leading-relaxed">
											{selectedLog.description}
										</p>
									) : (
										<p className="text-sm text-muted-foreground italic">
											Sin descripción disponible
										</p>
									)}
								</div>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
