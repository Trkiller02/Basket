import SearchForm from "@/components/search-form";

import DataTable from "@/components/tables/data-table";
import { TableSkeleton } from "@/components/tables/table-skeleton";
import type { DataRequest } from "@/utils/interfaces/athlete";
import { getDataTable } from "@/utils/table/getDataTable";
import { Suspense } from "react";

export default async function Home(props: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const searchParams = await props.searchParams;

	const data: Promise<DataRequest[] | undefined> = getDataTable(searchParams);

	return (
		<section>
			<SearchForm />
			<Suspense
				key={`${searchParams.ent}${searchParams.q}`}
				fallback={<TableSkeleton />}
			>
				<DataTable dataPromise={data} params={searchParams} />
			</Suspense>
		</section>
	);
}
