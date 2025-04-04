"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/table";
import { Skeleton } from "@heroui/skeleton";

export const TableSkeleton = () => (
	<Table
		aria-label="Example table with skeleton loading state"
		classNames={{
			base: "max-h-[calc(100dvh_-_150px)] overflow-y-auto min-h-[250px]",
		}}
	>
		<TableHeader>
			{Array.from({ length: 3 }).map((_, index) => (
				<TableColumn key={index.toString()}>
					<Skeleton className="w-full h-6" />
				</TableColumn>
			))}
		</TableHeader>
		<TableBody>
			{Array.from({ length: 4 }).map((_, index) => (
				<TableRow key={index.toString()}>
					<TableCell>
						<Skeleton className="w-full h-4" />
					</TableCell>
					<TableCell>
						<Skeleton className="w-full h-4" />
					</TableCell>
					<TableCell>
						<Skeleton className="w-full h-4" />
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);
