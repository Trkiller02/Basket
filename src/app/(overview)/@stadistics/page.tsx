import { memo } from "react";
import { Chart } from "@/components/charts";

async function StadisticsPage() {
	const [solvent] = await Promise.all([
		new Promise((resolve) => setTimeout(() => resolve("OK"), 1000)),
	]);

	const dataChart = [
		{
			name: "Technology",
			value: 73,
			colorFrom: "text-primary",
		},
		{
			name: "Industrials",
			value: 61,
			colorFrom: "text-content1",
		},
	];

	return (
		<article className="rounded-2xl shadow-md h-1/6 grid grid-cols-3 gap-4">
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
	);
}

export default memo(StadisticsPage);
