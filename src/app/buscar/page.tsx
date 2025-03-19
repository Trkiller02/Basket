import SearchForm from "@/components/search-form";

import DataTable from "@/components/tables/data-table";
import { TableSkeleton } from "@/components/tables/table-skeleton";
import type { DataRequest } from "@/utils/interfaces/athlete";
import { getDataTable } from "@/utils/table/getDataTable";
import { Suspense } from "react";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const data: Promise<DataRequest[]> = getDataTable(await searchParams);

	return (
		<section>
			<SearchForm />
			<Suspense
				key={`${(await searchParams).ent}${(await searchParams).q}`}
				fallback={<TableSkeleton />}
			>
				<DataTable data={data} params={searchParams} />
			</Suspense>
		</section>
	);
}
