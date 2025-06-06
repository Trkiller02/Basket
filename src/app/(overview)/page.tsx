import AthletesPreview from "@/components/previews/athletes/athletes-wrapper";
import SearchForm from "@/components/search-form";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoadingAthletesPreview from "@/components/previews/athletes/loading-preview";
import { getEntityData } from "@/lib/action-data";
import { MsgError } from "@/utils/messages";
import { auth } from "@/auth";

export const experimental_ppr = true;

export default async function Page() {
	const session = await auth();

	if (!session) redirect("/sesion/iniciar");

	if (session?.user?.role === "representante") {
		try {
			await getEntityData("representatives", session?.user.ci_number, true);
		} catch (error) {
			if ((error as Error).message === MsgError.NOT_FOUND)
				return redirect("/sesion/completar");
			console.log(error);
		}
	}

	return session?.user?.role === "representante" ? (
		<Suspense fallback={<LoadingAthletesPreview />}>
			<AthletesPreview userId={session?.user?.id} />
		</Suspense>
	) : (
		<SearchForm role={session?.user?.role} />
	);
}

/* 
import { Chart } from "@/components/charts";
import DataTable from "@/components/tables/data-table";
import { TableSkeleton } from "@/components/tables/table-skeleton";

import type { DataRequest } from "@/utils/interfaces/athlete";
import { getDataTable } from "@/utils/table/getDataTable";
import { Suspense } from "react";
export default async function Home({
	searchParams,
}: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
	const params = await searchParams;

	const dataChart = [
		{
			name: "Technology",
			value: 73,
			colorFrom: "text-pink-400",
		},
		{
			name: "Industrials",
			value: 61,
			colorFrom: "text-purple-400",
		},
	];

	const data: Promise<DataRequest[] | undefined> = getDataTable(params);

	return (
		<section className="flex flex-col gap-2 w-full">
			<article className="rounded-2xl shadow-md h-1/4 grid grid-cols-3 gap-4">
				<div className="flex flex-row items-center justify-center">
					<Chart data={dataChart} />
					<h5 className="text-lg font-semibold inline">
						Atletas Solventes
						<span className="block text-default-500 font-normal text-sm">
							Deportistas que han cancelado la mensualidad
						</span>
					</h5>
				</div>
				<div className="flex flex-row items-center justify-center">
					<Chart data={dataChart} />
					<h5 className="text-lg font-semibold inline">
						Categorias
						<span className="block text-default-500 font-normal text-sm">
							Jugadores por categoria
						</span>
					</h5>
				</div>
				<div className="flex flex-row items-center justify-center">
					<Chart data={dataChart} />
					<h5 className="text-lg font-semibold inline">
						Cantidad de Atletas
						<span className="block text-default-500 font-normal text-sm">
							Deportistas inscritos en el sistema
						</span>
					</h5>
				</div>
			</article>
			<SearchForm />
			<Suspense key={params.toString()} fallback={<TableSkeleton />}>
				<DataTable entity={params.ent ?? ""} dataPromise={data} />
			</Suspense>
		</section>
	);
}
 */
