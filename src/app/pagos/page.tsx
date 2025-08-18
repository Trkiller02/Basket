import { auth } from "@/auth";
import InvoicesFormForm from "@/components/payment/athletes-select";
import { fetchData } from "@/utils/fetchHandler";
import { redirect } from "next/navigation";

export default async function InvoicesPage() {
	const [session, pricing] = await Promise.all([
		auth(),
		fetchData<{ result: string }>("/api/config?property=pricing"),
	]);

	if (!session) return redirect("/sesion/iniciar");

	return (
		<InvoicesFormForm
			pricing={Number(pricing?.result)}
			representId={session?.user?.ci_number}
		/>
	);
}
