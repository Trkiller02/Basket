import DataTable from "@/components/tables/data-table";
import type { DataRequest } from "@/utils/interfaces/athlete";
import { getDataTable } from "@/utils/table/getDataTable";

export default async function TablePage({
	searchParams,
}: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
	const params = await searchParams;

	const data: Promise<DataRequest[] | undefined> = getDataTable(params);

	return <DataTable entity={params.ent ?? ""} dataPromise={data} />;
}
