"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreHorizontal, Printer, Search, User } from "lucide-react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import type { Invoices } from "@/utils/interfaces/invoice";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export default function PaymentsTable() {
	const { data: session } = useSession();

	const [filterData, setFilterData] = useState<{
		verified: string;
		page: string;
		limit: string;
		query?: string;
	}>({
		page: "1",
		limit: "10",
		query: session?.user.role === "representante" ? session?.user.id : "",
		verified: "all",
	});

	const apiUrl = useMemo(() => {
		const params = new URLSearchParams();

		if (filterData.verified !== "all") {
			params.append("verified", filterData.verified.toString());
		}

		if (filterData.query) {
			params.append("q", filterData.query);
		}

		params.append("p", filterData.page);
		params.append("l", filterData.limit);
		params.append("table", "true");

		return `/api/invoices?${params.toString()}`;
	}, [filterData]);

	const dateFmt = new Intl.DateTimeFormat("es-VE", {
		dateStyle: "medium",
		timeZone: "UTC",
	});

	const dateFmtMonth = new Intl.DateTimeFormat("es-VE", {
		month: "long",
	});

	const { data, isLoading } = useSWR<{
		result: Invoices[];
		pagination: {
			page: string;
			total_pages: number;
		};
	}>(apiUrl, fetcher);

	const handleSearch = useDebouncedCallback((value: string) => {
		setFilterData((s) => ({
			...s,
			query: value,
		}));
	}, 400);

	const rows = data?.result ?? [];

	const handleVerificationFilter = (value: string) => {
		setFilterData((s) => ({
			...s,
			verified: value,
			page: "1", // Reset to first page when filtering
		}));
	};

	// Columnas
	const columns: {
		key: keyof Invoices | "actions";
		label: string;
		width?: number;
	}[] = [
		{ key: "representative_id", label: "Representante", width: 160 },
		{ key: "payment_date", label: "Fecha de pago", width: 140 },
		{ key: "athlete_id", label: "Atleta", width: 160 },
		{ key: "verified", label: "Estado", width: 60 },
		{ key: "actions", label: "Actions", width: 60 },
	];

	const downloadPDF = async () => {
		const response = await fetch(`/api/reports/invoice/${session?.user.id}`);

		if (!response) throw new Error("Error al descargar PDF");

		const blob = await response.blob();

		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `Facturas-${dateFmtMonth.format(new Date())}-${new Date().getFullYear()}.pdf`;
		link.click();
	};

	return (
		<div className="space-y-4">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Label className="flex flex-col items-start">
						Criterio de búsqueda:
						<div className="relative">
							<Input
								placeholder="Rep o Atleta ID..."
								type="text"
								defaultValue={filterData.query}
								className="peer pe-9"
								onChange={({ target: { value } }) => handleSearch(value)}
								disabled={isLoading || session?.user.role === "representante"}
							/>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										size="icon"
										variant="link"
										aria-label="Buscar"
										className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground/80 peer-disabled:opacity-50"
									>
										<Search aria-hidden="true" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									Buscar por representante o atleta
								</TooltipContent>
							</Tooltip>
						</div>
					</Label>
					<Label className="flex flex-col items-start">
						Estado de verificación:
						<Select
							value={String(filterData.verified)}
							onValueChange={handleVerificationFilter}
							disabled={isLoading}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Todos los estados" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los estados</SelectItem>
								<SelectItem value="true">Verificado</SelectItem>
								<SelectItem value="false">Pendiente</SelectItem>
							</SelectContent>
						</Select>
					</Label>
					{session?.user.role === "representante" && (
						<Button
							onClick={() =>
								toast.promise(downloadPDF(), {
									loading: "Descargando PDF...",
									success: "Descargado correctamente",
									error: (error) => error.message,
								})
							}
							className="self-end bg-green-600 hover:bg-green-700 text-white"
						>
							<Printer className="h-4 w-4" />
							<span>
								Imprimir facturas de{" "}
								{dateFmtMonth.format(new Date()).toUpperCase()}-
								{new Date().getFullYear()}
							</span>
						</Button>
					)}
				</div>
				<div className="flex items-center gap-3">
					{/* Slot para futuros filtros (fecha, etc.) */}
				</div>
			</div>

			{/* Table */}
			<Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b w-full">
				<TableHeader className="w-full">
					<TableRow className="hover:bg-transparent">
						{columns.map((col) => (
							<TableHead
								key={col.key}
								style={{ width: col.width ? `${col.width}px` : undefined }}
								className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
							>
								{col.key === "actions" ? (
									<span className="sr-only">Actions</span>
								) : (
									col.label
								)}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<tbody aria-hidden="true" className="table-row h-1" />
				<TableBody>
					{isLoading ? (
						<TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
							<TableCell colSpan={columns.length} className="h-24 text-center">
								Cargando...
							</TableCell>
						</TableRow>
					) : rows.length > 0 ? (
						rows.map((row, key) => {
							const date =
								typeof row.payment_date === "string"
									? dateFmt.format(new Date(row.payment_date))
									: dateFmt.format(row.payment_date);
							return (
								<TableRow
									key={key.toString()}
									className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px hover:bg-accent/50"
								>
									<TableCell className="last:py-0 h-[inherit]">
										<div className="flex items-center gap-2">
											<User
												className="size-4 text-muted-foreground"
												aria-hidden="true"
											/>
											<span className="font-semibold">
												{row.representative_id}
											</span>
										</div>
									</TableCell>
									<TableCell className="last:py-0 h-[inherit]">
										<span className="font-semibold">{date}</span>
									</TableCell>
									<TableCell className="last:py-0 h-[inherit]">
										<span className="font-semibold">{row.athlete_id}</span>
									</TableCell>
									<TableCell className="last:py-0 h-[inherit]">
										<Badge
											variant={row.verified ? "default" : "outline"}
											className="capitalize"
										>
											{row.verified ? "Verificado" : "Pendiente"}
										</Badge>
									</TableCell>
									<TableCell className="last:py-0 h-[inherit]">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<div className="flex justify-end">
													<Button
														size="icon"
														variant="ghost"
														className="shadow-none text-muted-foreground/60"
														aria-label="Ver acciones"
													>
														<MoreHorizontal
															className="size-5"
															aria-hidden="true"
														/>
													</Button>
												</div>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-auto">
												<DropdownMenuItem asChild>
													<Link href={`/pagos/historial/${row.id}`}>
														Detalles
													</Link>
												</DropdownMenuItem>
												{session?.user.role !== "representante" && (
													<>
														<DropdownMenuItem asChild>
															<Link
																href={`/buscar/representante/${row.representative_id}`}
															>
																Ver representante
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link href={`/buscar/atleta/${row.athlete_id}`}>
																Ver atleta
															</Link>
														</DropdownMenuItem>
													</>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
							<TableCell colSpan={columns.length} className="h-24 text-center">
								Sin resultados.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
				<tbody aria-hidden="true" className="table-row h-1" />
			</Table>

			{/* Pagination (server-driven via filterData) */}
			{(data?.result?.length ?? 0) > 0 && (
				<div className="flex items-center justify-between gap-3">
					<p
						className="flex-1 whitespace-nowrap text-sm text-muted-foreground"
						aria-live="polite"
					>
						{"Pagina "}
						<span className="text-foreground">
							{Number(filterData.page ?? "1")}
						</span>
					</p>
					<Pagination className="w-auto">
						<PaginationContent className="gap-3">
							<PaginationItem>
								<Button
									variant="outline"
									className="aria-disabled:pointer-events-none aria-disabled:opacity-50 bg-transparent"
									onClick={() =>
										setFilterData((s) => ({
											...s,
											page: String(Math.max(1, Number(s.page ?? "1") - 1)),
										}))
									}
									disabled={Number(filterData.page ?? "1") <= 1 || isLoading}
									aria-label="Go to previous p"
								>
									{"Anterior"}
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									variant="outline"
									className="aria-disabled:pointer-events-none aria-disabled:opacity-50 bg-transparent"
									onClick={() =>
										setFilterData((s) => ({
											...s,
											page: String(Number(s.page ?? "1") + 1),
										}))
									}
									disabled={
										isLoading ||
										(data?.pagination.total_pages ?? 0) <
											Number(filterData.page ?? "1")
									}
									aria-label="Go to next p"
								>
									{"Siguiente"}
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
