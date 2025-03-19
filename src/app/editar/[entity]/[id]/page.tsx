import { AthletesEditForm } from "@/components/edit-forms/athletes";
import HealthEditForm from "@/components/edit-forms/health";
import { RepresentativeEditForm } from "@/components/edit-forms/representative";
import { getEntityDataById } from "@/lib/action-data";
import { fetchData } from "@/utils/fetchHandler";
import type { Athlete } from "@/utils/interfaces/athlete";
import type { Health } from "@/utils/interfaces/health";
import type { Representative } from "@/utils/interfaces/representative";
import { notFound } from "next/navigation";

export default async function Page({
	params,
}: { params: Promise<{ entity: string; id: string }> }) {
	const { entity, id } = await params;
	if (!["atleta", "representante", "usuario"].includes(entity))
		return notFound();

	const data = await fetchData<Athlete | Representative>(
		`/api/${
			entity === "atleta"
				? "athletes"
				: entity === "representante"
					? "representatives"
					: "users"
		}/${id}`,
	);

	if (!data) return notFound();

	const healthData =
		entity === "atleta"
			? await getEntityDataById<Health>("health", data.id ?? "")
			: undefined;

	return (
		<section>
			{entity === "atleta" && (
				<>
					<AthletesEditForm data={data as Athlete} />
					<HealthEditForm data={healthData} />
				</>
			)}
			{entity === "representante" && (
				<RepresentativeEditForm data={data as Representative} />
			)}
		</section>
	);
}
