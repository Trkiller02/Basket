import InvoicesForm from "@/components/forms/invoices";
import { fetchData } from "@/utils/fetchHandler";
import type { Athlete } from "@/utils/interfaces/athlete";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function InvoicesPage() {
	const session = await auth();

	if (!session) redirect("/sesion/iniciar");

	const [athletes, pricing] = await Promise.all([
		fetchData<{ result?: Athlete[] }>(
			`/api/repr-athletes/${session.user?.id}?invoice=true`,
		),
		fetchData<{ result: string }>("/api/config?property=pricing"),
	]);

	return (
		<div className="flex w-full h-full flex-col items-center justify-center">
			<InvoicesForm
				athleteList={athletes?.result}
				pricing={pricing?.result ?? "0"}
				representId={
					session?.user?.role === "representante"
						? session?.user?.id
						: undefined
				}
			/>
		</div>
	);
}
