import { fetchData } from "@/utils/fetchHandler";
import { redirect } from "next/navigation";
import type { Representative } from "@/utils/interfaces/representative";
import type { Athlete } from "@/utils/interfaces/athlete";
import type { User } from "@/utils/interfaces/user";
import type { Health } from "@/utils/interfaces/health";
import {
	adminEntitiesList,
	entitiesList,
	entityToFetch,
} from "@/utils/getEntity";
import AthleteEditForm from "@/components/edit-forms/athletes";
import HealthEditForm from "@/components/edit-forms/health";
import RepresentativeEditForm from "@/components/edit-forms/representative";
import UserEditForm from "@/components/edit-forms/user";
import { auth } from "@/auth";
import { Separator } from "@/components/ui/separator";

interface EntityPageParams {
	entity: string;
	id: string;
}

export default async function EditPage({
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
			? fetchData<Health>(`/api/health/${id}?formAthlete=true`)
			: undefined,
	]);

	switch (entity) {
		case "atleta":
			return (
				<>
					<AthleteEditForm data={data as Athlete} />
					<Separator className="my-4" />
					<HealthEditForm data={health as Health} />
				</>
			);
		case "representante":
			return <RepresentativeEditForm data={data as Representative} />;
		default:
			return <UserEditForm data={data as User} />;
	}
}
