"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	EyeIcon,
	Filter,
	MoreVertical,
	PencilIcon,
	Search,
	UserCircle2,
} from "lucide-react";
import type { User } from "@/utils/interfaces/user";
import type { Athlete } from "@/utils/interfaces/athlete";
import {
	getInvoiceStatus,
	invoiceStatus,
	listInvoiceStatus,
} from "@/utils/invoiceHelper";
import Link from "next/link";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";
import { categories } from "@/utils/getCategories";
import Image from "next/image";
import type { Session } from "next-auth";
import { getEntityToFetch } from "@/utils/table/getDataTable";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";
import { ExtractUserProps } from "@/utils/table/extractProps";
import { adminEntitiesList } from "@/utils/getEntity";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export interface UserTable
	extends Omit<User, "password" | "repeat_password" | "restore_code">,
		Partial<Pick<Athlete, "category" | "position" | "solvent">> {}

type ColumnKey =
	| "name"
	| "ci_number"
	| "email"
	| "category"
	| "solvent"
	| "actions";

export default function ContactsTableNew({
	session,
}: {
	session: Session | null;
}) {
	const [filterData, setFilterData] = useState<{
		query?: string;
		page?: string;
		limit?: string;
	}>({
		page: "1",
		limit: "10",
	});

	const [entity, setEntity] = useState<"usuario" | "atleta" | "representante">(
		session?.user?.role === "representante" ? "atleta" : "usuario",
	);

	const { data, isLoading } = useSWR<{
		result: UserTable[];
		pagination: {
			page: string;
			total_pages: number;
		};
	}>(
		session?.user?.role === "representante"
			? `/api/repr-athletes/${session?.user?.id}?table=true`
			: `/api/${getEntityToFetch(entity)}?${new URLSearchParams(filterData).toString()}`,
		fetcher,
	);

	const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
	const [solventFilter, setSolventFilter] = useState<number | undefined>();

	// Visibilidad de columnas (manteniendo paridad con el original)
	const [hiddenCols, setHiddenCols] = useState<Set<ColumnKey>>(new Set([]));

	useEffect(() => {
		if (session?.user?.role !== "representante")
			setHiddenCols((prev) => prev.add("category").add("solvent"));
		else setHiddenCols((prev) => prev.add("actions"));

		if (entity === "atleta")
			setHiddenCols((prev) => {
				prev.delete("category");
				prev.delete("solvent");

				return prev;
			});
	}, [session?.user?.role, entity]);

	const baseRows = data
		? entity === "usuario"
			? data.result
			: data.result.map(ExtractUserProps)
		: [];

	// Filtros en cliente
	const filteredRows = useMemo(() => {
		if (entity !== "atleta") return baseRows;

		let rows = baseRows;

		if (categoryFilter && categoryFilter.length > 0) {
			rows = rows.filter((r) => (r.category ?? "") === categoryFilter);
		}
		if (typeof solventFilter === "number") {
			rows = rows.filter((r) => {
				const s = (r.solvent as number) ?? 0;
				return s === solventFilter;
			});
		}
		return rows;
	}, [baseRows, categoryFilter, solventFilter, entity]);

	const handleChangeFilter = useDebouncedCallback((value: string) => {
		setFilterData((state) => ({
			...state,
			query: value,
		}));
	}, 450);

	// Metadatos de columnas (sin select ni sorting)
	const columnMeta: { key: ColumnKey; label: string; width: number }[] = [
		{ key: "name", label: "Nombre", width: 180 },
		{ key: "ci_number", label: "C.I / Rol", width: 110 },
		{ key: "email", label: "Contacto", width: 140 },
		{ key: "category", label: "Categoria / Posición", width: 140 },
		{ key: "solvent", label: "Solvencia", width: 90 },
		{ key: "actions", label: "Actions", width: 60 },
	];

	const visibleColumns = columnMeta.filter((c) => !hiddenCols.has(c.key));

	return (
		<TooltipProvider>
			<div className="space-y-4">
				{/* Actions */}

				{session?.user?.role !== "representante" && (
					<div className="flex flex-wrap items-center justify-between gap-3">
						{/* Left side */}
						<div className="flex items-center gap-3">
							{/* Filter by name */}
							<Label className="flex flex-col items-start">
								{"Criterio de búsqueda:"}
								<div className="relative">
									<Input
										placeholder="3..."
										type="tel"
										className="peer pe-9"
										required
										onChange={({ target: { value } }) =>
											handleChangeFilter(value)
										}
									/>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												type="button"
												size="icon"
												variant="link"
												aria-label="Buscar entidad"
												className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground/80 peer-disabled:opacity-50"
											>
												<Search aria-hidden="true" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Buscar registro</TooltipContent>
									</Tooltip>
								</div>
								<p className="text-muted-foreground pr-4">
									{"Prefijo: V o E. Ej: V30..."}
								</p>
							</Label>
						</div>
						{/* Right side */}
						<div className="flex items-center gap-3">
							{/* Filter by status */}
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline">
										<Filter
											className="size-5 -ms-1.5 text-muted-foreground/60"
											size={20}
											aria-hidden="true"
										/>
										{"Filtros"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto min-w-36 p-3" align="end">
									<div className="space-y-3">
										<Select
											defaultValue={entity}
											onValueChange={(
												value: "atleta" | "representante" | "usuario",
											) => setEntity(value)}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Entidad" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem key="atleta" value="atleta">
													Atletas
												</SelectItem>
												<SelectItem key="representante" value="representante">
													Representantes
												</SelectItem>
												<SelectItem key="usuario" value="usuario">
													Usuarios
												</SelectItem>
											</SelectContent>
										</Select>

										{entity === "atleta" && (
											<>
												<Select
													defaultValue={categoryFilter}
													onValueChange={(value) => setCategoryFilter(value)}
												>
													<SelectTrigger className="w-[180px]">
														<SelectValue placeholder="Categoria" />
													</SelectTrigger>
													<SelectContent>
														{categories.map((category) => (
															<SelectItem key={category} value={category}>
																{category}
															</SelectItem>
														))}
													</SelectContent>
												</Select>

												<Select
													defaultValue={String(solventFilter)}
													onValueChange={(value) =>
														setSolventFilter(
															Number.isNaN(value) ? undefined : +value,
														)
													}
												>
													<SelectTrigger className="w-[180px]">
														<SelectValue placeholder="Solvencia" />
													</SelectTrigger>
													<SelectContent>
														{invoiceStatus.map((status, index) => (
															<SelectItem
																key={index.toString()}
																value={index.toString()}
															>
																{status}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</>
										)}
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</div>
				)}

				{/* Table */}
				<Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b w-full">
					<TableHeader className="w-full">
						<TableRow className="hover:bg-transparent">
							{visibleColumns.map((col) => {
								return (
									<TableHead
										key={col.key}
										style={{ width: `${col.width}px` }}
										className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
									>
										{col.key === "actions" ? (
											<span className="sr-only">Actions</span>
										) : (
											<span>{col.label}</span>
										)}
									</TableHead>
								);
							})}
						</TableRow>
					</TableHeader>

					<tbody aria-hidden="true" className="table-row h-1" />
					<TableBody>
						{isLoading ? (
							<TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
								<TableCell
									colSpan={visibleColumns.length}
									className="h-24 text-center"
								>
									{"Cargando..."}
								</TableCell>
							</TableRow>
						) : filteredRows.length > 0 ? (
							filteredRows.map((row) => {
								const id = String(row.ci_number ?? "");
								const solventValue = (row.solvent as number) ?? 0;
								const SolventIcon = listInvoiceStatus[solventValue];

								return (
									<TableRow
										key={id}
										className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px hover:bg-accent/50"
									>
										{visibleColumns.map((col) => {
											switch (col.key) {
												case "name":
													return (
														<TableCell
															key={`${id}-name`}
															className="last:py-0 h-[inherit]"
														>
															<div className="flex flex-row justify-center space-x-4">
																<Avatar className="size-8 md:size-10">
																	<AvatarImage
																		src={row.image ?? "/placeholder.svg"}
																		alt="profile-image"
																	/>
																	<AvatarFallback>
																		{row.lastname[0]}
																	</AvatarFallback>
																</Avatar>

																<div className="flex-1 md:text-left">
																	<p className="font-semibold">
																		{row.lastname}
																		<span className="font-medium text-muted-foreground block">
																			{row.name}
																		</span>
																	</p>
																</div>
															</div>
															{/* <div className="flex items-center gap-3">
																{row.image ? (
																	<Image
																		className="rounded-full aspect-square h-full w-auto"
																		src={
																			row.image ||
																			"/placeholder.svg?height=32&width=32&query=avatar"
																		}
																		width={32}
																		height={32}
																		alt={row.name ?? "avatar"}
																	/>
																) : (
																	<UserCircle2 className="text-gray-300" />
																)}
																<p className="font-semibold">
																	{row.lastname}
																	<span className="font-medium text-muted-foreground block">
																		{row.name}
																	</span>
																</p>
															</div> */}
														</TableCell>
													);

												case "ci_number":
													return (
														<TableCell
															key={`${id}-ci`}
															className="last:py-0 h-[inherit]"
														>
															<p className="font-semibold">
																{row.ci_number}
																<span className="font-medium text-muted-foreground block uppercase">
																	{row.role}
																</span>
															</p>
														</TableCell>
													);

												case "email":
													return (
														<TableCell
															key={`${id}-email`}
															className="last:py-0 h-[inherit]"
														>
															<p className="font-semibold">
																<Link href={`mailto:${row.email}`}>
																	{row.email}
																</Link>
																<span className="font-medium text-muted-foreground block">
																	{row.phone_number ?? ""}
																</span>
															</p>
														</TableCell>
													);

												case "category":
													return (
														<TableCell
															key={`${id}-cat`}
															className="last:py-0 h-[inherit]"
														>
															<p className="font-semibold">
																{row.category ?? ""}
																<span className="font-medium text-muted-foreground block">
																	{row.position ?? ""}
																</span>
															</p>
														</TableCell>
													);

												case "solvent":
													return (
														<TableCell
															key={`${id}-solvent`}
															className=" h-[inherit]"
														>
															{row.role === "atleta" ? (
																<Badge
																	asChild
																	variant={
																		solventValue === 0
																			? "destructive"
																			: undefined
																	}
																>
																	<Link
																		href={
																			solventValue === 0
																				? `/pagos?q=${row.ci_number}`
																				: "/pagos/historial"
																		}
																	>
																		<SolventIcon />
																		<p>
																			{getInvoiceStatus(
																				solventValue,
																			).toUpperCase()}
																		</p>
																	</Link>
																</Badge>
															) : null}
														</TableCell>
													);

												case "actions":
													return session?.user?.role ===
														"representante" ? null : (
														<TableCell
															key={`${id}-actions`}
															className="last:py-0 h-[inherit]"
														>
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<div className="flex justify-end">
																		<Button
																			size="icon"
																			variant="ghost"
																			className="shadow-none text-muted-foreground/60"
																			aria-label="Edit item"
																		>
																			<MoreVertical
																				className="size-5"
																				size={20}
																				aria-hidden="true"
																			/>
																		</Button>
																	</div>
																</DropdownMenuTrigger>
																<DropdownMenuContent
																	align="end"
																	className="w-auto"
																>
																	<DropdownMenuGroup>
																		<DropdownMenuItem asChild>
																			<Link
																				href={`/buscar/${adminEntitiesList.has(row.role ?? "") ? "usuario" : row.role}/${row.ci_number}`}
																			>
																				<EyeIcon
																					className="size-5"
																					size={20}
																					aria-hidden="true"
																				/>
																				Ver
																			</Link>
																		</DropdownMenuItem>
																		<DropdownMenuItem asChild>
																			<Link
																				href={`/editar/${adminEntitiesList.has(row.role ?? "") ? "usuario" : row.role}/${row.ci_number}`}
																			>
																				<PencilIcon
																					className="size-5"
																					size={20}
																					aria-hidden="true"
																				/>
																				Editar
																			</Link>
																		</DropdownMenuItem>
																	</DropdownMenuGroup>
																</DropdownMenuContent>
															</DropdownMenu>
														</TableCell>
													);

												default:
													return null;
											}
										})}
									</TableRow>
								);
							})
						) : (
							<TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
								<TableCell
									colSpan={visibleColumns.length}
									className="h-24 text-center"
								>
									{"Sin resultados."}
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
											(data?.pagination?.total_pages ?? 0) <
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
		</TooltipProvider>
	);
}
