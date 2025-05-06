import InvoicesForm from "@/components/forms/invoices";
import { auth } from "@/lib/auth";
import { fetchData } from "@/utils/fetchHandler";
import type { Athlete } from "@/utils/interfaces/athlete";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function InvoicesPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect("/sesion/iniciar");

	const athletes = await fetchData<{ result?: Athlete[] }>(
		`/api/repr-athletes/${session.user.id}?invoice=true`,
	);

	return (
		<div className="flex w-full h-full flex-col items-center justify-center">
			<InvoicesForm athleteList={athletes?.result} />
		</div>
	);
}
