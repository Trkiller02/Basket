import AthleteWrap from "@/components/edit-forms/athlete-wrap";
import { AthletesEditForm } from "@/components/edit-forms/athletes";
import HealthEditForm from "@/components/edit-forms/health";
import { RepresentativeEditForm } from "@/components/edit-forms/representative";
import { getEntityData, getEntityDataById } from "@/lib/action-data";
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

	const data = await getEntityData<Athlete | Representative>(
		entity === "atleta"
			? "athletes"
			: entity === "representante"
				? "representatives"
				: "users",
		id,
	);

	if (!data) return notFound();

	const healthData =
		entity === "atleta"
			? getEntityDataById<Health>("health", data.id ?? "", true)
			: undefined;

	return (
		<section className="flex h-full gap-4 justify-center items-center pb-6">
			{entity === "atleta" && (
				<AthleteWrap
					healthPromise={healthData as Promise<Health>}
					athletesData={data as Athlete}
				/>
			)}
			{entity === "representante" && (
				<RepresentativeEditForm data={data as Representative} />
			)}
		</section>
	);
}
