import AthleteResume from "@/components/details/athlete";
import { fetchData } from "@/utils/fetchHandler";
import { notFound, redirect } from "next/navigation";
import RepresentativeResume from "@/components/details/representative";
import type { Representative } from "@/utils/interfaces/representative";
import type { Athlete } from "@/utils/interfaces/athlete";
import { UserCard } from "@/components/details/user";
import type { User } from "@/utils/interfaces/user";
import {
	adminEntitiesList,
	entitiesList,
	entityToFetch,
} from "@/utils/getEntity";
import { auth } from "@/auth";
import type { Health } from "@/utils/interfaces/health";
import { HealthResume } from "@/components/details/health";

interface EntityPageParams {
	entity: string;
	id: string;
}

export default async function EntityPage({
	params,
}: {
	params: Promise<EntityPageParams>;
}) {
	const { entity, id } = await params;

	if (!entitiesList.has(entity) || id === undefined) return redirect("/");

	const session = await auth();

	if (!adminEntitiesList.has(session?.user.role ?? "")) return redirect("/");

	const [data, health] = await Promise.all([
		fetchData(
			`/api/${entityToFetch[entity as keyof typeof entityToFetch]}/${id}`,
		),
		entity === "atleta"
			? fetchData(`/api/health/${id}?formAthlete=true`)
			: undefined,
	]);

	if (!data) return notFound();

	switch (entity) {
		case "usuario":
			return <UserCard user={data as User} />;
		case "representante":
			return <RepresentativeResume data={data as Representative} />;
		default:
			return (
				<>
					<AthleteResume formView data={data as Athlete} />
					<HealthResume data={health as Health} />
				</>
			);
	}
}
