import AthleteResume from "@/components/details/athlete";
import { fetchData } from "@/utils/fetchHandler";
import { redirect } from "next/navigation";
import RepresentativeResume from "@/components/details/representative";
import type { Representative } from "@/utils/interfaces/representative";
import type { Athlete } from "@/utils/interfaces/athlete";
import { UserCard } from "@/components/details/user";
import type { User } from "@/utils/interfaces/user";
import { adminEntitiesList } from "@/utils/getEntity";
import { auth } from "@/auth";

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

	const session = await auth();

	if (!adminEntitiesList.has(session?.user.role ?? "")) return redirect("/");

	if (adminEntitiesList.has(entity)) return redirect(`/editar/usuario/${id}`);

	const data = await fetchData(`/api/${entity}/${id}`);

	if (
		!["representante", "usuario", "atleta"].includes(entity) ||
		id === undefined
	)
		return redirect("/");

	if (entity === "representante")
		return <RepresentativeResume data={data as Representative} />;

	if (entity === "usuario") return <UserCard user={data as User} />;

	return <AthleteResume data={data as Athlete} />;
}
