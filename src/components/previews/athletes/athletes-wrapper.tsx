import { fetchData } from "@/utils/fetchHandler";
import type { Athlete } from "@/utils/interfaces/athlete";
import { AthletesCard } from "./athletes-card";

export default async function AthletesPreview({ userId }: { userId?: string }) {
	if (!userId) return <div>Inicie sesión para ver los atletas</div>;

	const athletesFetching = await fetchData<{ result?: Athlete[] }>(
		`/api/repr-athletes/${userId}`,
	);

	if (!athletesFetching) return <h1>No se pudieron obtener los atletas</h1>;

	const { result: athletes } = athletesFetching;

	return (
		<section className="flex flex-row gap-2">
			{athletes?.map((item, id) => (
				<AthletesCard key={id.toString()} athlete={item} />
			))}
		</section>
	);
}
