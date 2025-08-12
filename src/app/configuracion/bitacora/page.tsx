"use client";

import { useState } from "react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
	type ColumnFiltersState,
} from "@tanstack/react-table";
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
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
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
	Users,
	Eye,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MainDialog } from "@/components/details/main-dialog";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";

// Tipo para los logs del sistema basado en el formato proporcionado
type SystemLog = {
	id: number;
	user_id: string;
	description: string | null;
	action:
		| "MODIFICO"
		| "CREO"
		| "ELIMINO"
		| "PAGO"
		| "INICIO SESION"
		| "CERRO SESION";
	reference_id: string | null;
	created_at: string | null;
};

const actions = [
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
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "created_at", desc: true },
	]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [selectedAction, setSelectedAction] = useState("all");
	const [dateFrom, setDateFrom] = useState<Date>();
	const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

	// Definir columnas directamente sin columnHelper
	const columns: ColumnDef<SystemLog>[] = [
		{
			accessorKey: "created_at",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="h-auto p-0 font-semibold"
					>
						Fecha y Hora
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4" />
						)}
					</Button>
				);
			},
			cell: ({ getValue }) => (
				<div className="font-mono text-sm">
					{formatDateTime(getValue() as string | null)}
				</div>
			),
		},
		{
			accessorKey: "action",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="h-auto p-0 font-semibold"
					>
						Acción
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4" />
						)}
					</Button>
				);
			},
			cell: ({ getValue }) => {
				const action = getValue() as string;
				return (
					<Badge
						className={`${getActionColor(action)} flex items-center gap-1 w-fit`}
					>
						{getActionIcon(action)}
						{action}
					</Badge>
				);
			},
		},
		{
			accessorKey: "user_id",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="h-auto p-0 font-semibold"
					>
						Usuario
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4" />
						)}
					</Button>
				);
			},
			cell: ({ getValue }) => (
				<div className="flex items-center gap-2">
					<User className="h-4 w-4 text-muted-foreground" />
					{getValue() as string}
				</div>
			),
		},
		{
			accessorKey: "reference_id",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="h-auto p-0 font-semibold"
					>
						Referencia
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4" />
						)}
					</Button>
				);
			},
			cell: ({ getValue }) => {
				const referenceId = getValue() as string | null;
				return (
					<div className="font-mono text-sm text-muted-foreground">
						{referenceId || "N/A"}
					</div>
				);
			},
		},
		{
			id: "actions",
			header: "Acciones",
			cell: ({ row }) => {
				const log = row.original;
				return (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSelectedLog(log)}
						className="h-8 w-8 p-0"
					>
						<Eye className="h-4 w-4" />
						<span className="sr-only">Ver detalles</span>
					</Button>
				);
			},
		},
	];

	const { data: systemLogs, isLoading } = useSWR<SystemLog[]>(
		"/api/history",
		fetcher,
	);

	const table = useReactTable({
		data: systemLogs ?? [],
		columns,
		state: {
			sorting,
			columnFilters,
			globalFilter,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	});

	const handleExport = () => {
		const csvContent = [
			["ID", "Fecha y Hora", "Usuario", "Acción", "Descripción", "Referencia"],
			...table
				.getFilteredRowModel()
				.rows.map((row) => [
					row.original.id,
					formatDateTime(row.original.created_at),
					row.original.user_id,
					row.original.action,
					row.original.description || "",
					row.original.reference_id || "",
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

			{/* Estadísticas rápidas */}
			{/* 
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total de Actividades
						</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{systemLogs.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Creaciones</CardTitle>
						<Plus className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{systemLogs.filter((log) => log.action === "CREO").length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pagos</CardTitle>
						<CreditCard className="h-4 w-4 text-purple-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">
							{systemLogs.filter((log) => log.action === "PAGO").length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Usuarios Activos
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{new Set(systemLogs.map((log) => log.user_id)).size}
						</div>
					</CardContent>
				</Card>
			</div> 
			/*}

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
							<Select value={selectedAction} onValueChange={setSelectedAction}>
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

			{/* Tabla de logs con TanStack Table */}
			<Card>
				<CardHeader>
					<CardTitle>Registro de Actividades</CardTitle>
					<CardDescription>
						Mostrando {table.getFilteredRowModel().rows.length} actividades
						filtradas de {systemLogs?.length} totales
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											Cargando...
										</TableCell>
									</TableRow>
								) : table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No se encontraron actividades.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					{/* Paginación con TanStack Table */}
					<div className="flex items-center justify-between space-x-2 py-4">
						<div className="flex items-center space-x-2">
							<p className="text-sm font-medium">Filas por página</p>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(value) => {
									table.setPageSize(Number(value));
								}}
							>
								<SelectTrigger className="h-8 w-[70px]">
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-6 lg:space-x-8">
							<div className="flex w-[100px] items-center justify-center text-sm font-medium">
								Página {table.getState().pagination.pageIndex + 1} de{" "}
								{table.getPageCount()}
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
									onClick={() => table.setPageIndex(0)}
									disabled={!table.getCanPreviousPage()}
								>
									<span className="sr-only">Ir a la primera página</span>
									<ChevronsLeft className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									className="h-8 w-8 p-0 bg-transparent"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
								>
									<span className="sr-only">Ir a la página anterior</span>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									className="h-8 w-8 p-0 bg-transparent"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
								>
									<span className="sr-only">Ir a la página siguiente</span>
									<ChevronRight className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
									onClick={() => table.setPageIndex(table.getPageCount() - 1)}
									disabled={!table.getCanNextPage()}
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
			<MainDialog
				title="Detalles de la Actividad"
				description="Información completa del registro de actividad del sistema"
			>
				{selectedLog && (
					<div className="space-y-6">
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
				)}
			</MainDialog>
		</div>
	);
}
