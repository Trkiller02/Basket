"use client";

import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from "@heroui/table";

import { User as UserHeroUI } from "@heroui/user";
import { Chip, type ChipProps } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";

import { Delete, Edit, Eye } from "lucide-react";
import { primaryColumns, athleteColumns } from "@/utils/table/tableList";
import type { DataRequest } from "@/utils/interfaces/athlete";
import { use, useCallback } from "react";

const statusColorMap: Record<string, ChipProps["color"]> = {
	1: "success",
	3: "warning",
	0: "danger",
};

export default function DataTable(props: {
	data: Promise<DataRequest[]>;
	params: Promise<{ [key: string]: string | undefined }>;
}) {
	const renderUserCell = useCallback(
		(user: DataRequest, columnKey: React.Key) => {
			const cellValue = user[columnKey as keyof DataRequest];

			switch (columnKey) {
				case "name":
					return (
						<UserHeroUI
							avatarProps={{
								radius: "lg",
								fallback: `${cellValue?.toString().charAt(0)}${user.lastname.charAt(0)}`,
							}}
							description={user.email}
							name={`${cellValue} ${user.lastname}`}
						>
							{user.ci_number}
						</UserHeroUI>
					);
				case "email":
					return (
						<div className="flex flex-col">
							<p className="text-bold text-sm capitalize">{cellValue}</p>
							<p className="text-bold text-sm capitalize text-default-400">
								{user.phone_number}
							</p>
						</div>
					);
				case "role_id":
					return <p className="text-bold text-sm capitalize">{cellValue}</p>;
				case "actions":
					return (
						<div className="relative flex items-center gap-2">
							<Tooltip content="Detalles">
								<span className="text-lg text-default-400 cursor-pointer active:opacity-50">
									<Eye />
								</span>
							</Tooltip>
							<Tooltip content="Editar">
								<span className="text-lg text-default-400 cursor-pointer active:opacity-50">
									<Edit />
								</span>
							</Tooltip>
							<Tooltip color="danger" content="Eliminar">
								<span className="text-lg text-danger cursor-pointer active:opacity-50">
									<Delete />
								</span>
							</Tooltip>
						</div>
					);
				default:
					break;
			}
		},
		[],
	);

	const renderAthleteCell = useCallback(
		(user: DataRequest, columnKey: React.Key) => {
			const cellValue = user[columnKey as keyof DataRequest];

			switch (columnKey) {
				case "name":
					return (
						<UserHeroUI
							avatarProps={{
								radius: "lg",
								src: user.image,
								fallback: `${cellValue?.toString().charAt(0)}${user.lastname.charAt(0)}`,
							}}
							description={user.email}
							name={`${cellValue} ${user.lastname}`}
						>
							{user.ci_number}
						</UserHeroUI>
					);

				case "email":
					return (
						<div className="flex flex-col">
							<p className="text-bold text-sm capitalize">{cellValue}</p>
							<p className="text-bold text-sm capitalize text-default-400">
								{user.phone_number}
							</p>
						</div>
					);
				case "category":
					return (
						<div className="flex flex-col">
							<p className="text-bold text-sm capitalize">{cellValue}</p>
							<p className="text-bold text-sm capitalize text-default-400">
								{user.position}
							</p>
						</div>
					);
				case "solvent":
					return (
						<Chip
							className="capitalize"
							color={statusColorMap[user.solvent ?? 0]}
							size="sm"
							variant="flat"
						>
							{cellValue === 1
								? "Solvente"
								: cellValue === 0
									? "No solvente"
									: "Becado"}
						</Chip>
					);
				case "actions":
					return (
						<div className="relative flex items-center gap-2">
							<Tooltip content="Detalles">
								<span className="text-lg text-default-400 cursor-pointer active:opacity-50">
									<Eye />
								</span>
							</Tooltip>
							<Tooltip content="Editar">
								<span className="text-lg text-default-400 cursor-pointer active:opacity-50">
									<Edit />
								</span>
							</Tooltip>
							<Tooltip color="danger" content="Eliminar">
								<span className="text-lg text-danger cursor-pointer active:opacity-50">
									<Delete />
								</span>
							</Tooltip>
						</div>
					);
				default:
					break;
			}
		},
		[],
	);

	const ent = use(props.params).ent;
	const data = use(props.data);

	return (
		<Table aria-label="Data table">
			<TableHeader
				columns={ent === "estudiante" ? athleteColumns : primaryColumns}
			>
				{(column) => (
					<TableColumn
						key={column.uid}
						align={column.uid === "actions" ? "center" : "start"}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody items={data ?? []} emptyContent="Sin datos...">
				{(item) => (
					<TableRow key={item.id}>
						{(columnKey) => (
							<TableCell>
								{ent === "estudiante"
									? renderAthleteCell(item, columnKey)
									: renderUserCell(item, columnKey)}
							</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
