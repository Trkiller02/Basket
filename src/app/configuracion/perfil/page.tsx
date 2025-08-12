import { auth } from "@/auth";
import ProfileInfo from "@/components/auth/profile-info";
import RepresentativeProfileInfo from "@/components/auth/representative-info";
import { fetchData } from "@/utils/fetchHandler";
import type { Representative } from "@/utils/interfaces/representative";
import type { User } from "@/utils/interfaces/user";
import { notFound, redirect } from "next/navigation";

export default async function ProfilePage() {
	const session = await auth();

	if (!session) return redirect("/sesion/iniciar");

	if (session.user?.role === "representante") {
		const data = await fetchData<Representative>(
			`/api/representatives/${session.user.ci_number}`,
		);

		if (!data) return notFound();

		return <RepresentativeProfileInfo data={data} />;
	}

	const data = await fetchData<User>(`/api/users/${session.user?.ci_number}`);

	if (!data) return notFound();

	return <ProfileInfo data={data} />;
}
