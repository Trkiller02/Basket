import { fetchData } from "@/utils/fetchHandler";
import { redirect } from "next/navigation";
import type { Representative } from "@/utils/interfaces/representative";
import type { Athlete } from "@/utils/interfaces/athlete";
import type { User } from "@/utils/interfaces/user";
import type { Health } from "@/utils/interfaces/health";
import { adminEntitiesList, entitiesList } from "@/utils/getEntity";
import AthleteEditForm from "@/components/edit-forms/athletes";
import HealthEditForm from "@/components/edit-forms/health";
import RepresentativeEditForm from "@/components/edit-forms/representative";
import UserEditForm from "@/components/edit-forms/user";
import { auth } from "@/auth";

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

	const session = await auth();

	if (!adminEntitiesList.has(session?.user.role ?? "")) return redirect("/");

	if (adminEntitiesList.has(entity)) return redirect(`/editar/usuario/${id}`);

	if (!entitiesList.has(entity) || id === undefined) return redirect("/");

	const data = await fetchData(`/api/${entity}/${id}`);

	if (entity === "representante")
		return <RepresentativeEditForm data={data as Representative} />;

	if (entity === "usuario") return <UserEditForm data={data as User} />;

	const [athlete, health] = await Promise.all([
		fetchData<Athlete>(`/api/athletes/${id}`),
		fetchData<Health>(`/api/health/${id}?formAthlete=true`),
	]);

	return (
		<>
			<AthleteEditForm data={athlete as Athlete} />
			<HealthEditForm data={health as Health} />
		</>
	);
}
