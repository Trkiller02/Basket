import { InvoiceCard } from "@/components/payment/invoice";
import { fetchData } from "@/utils/fetchHandler";
import type { Invoices } from "@/utils/interfaces/invoice";
import { redirect } from "next/navigation";

export default async function InvoicesHistoryDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const data = await fetchData<Invoices>(`/api/invoices/${id}`);

	if (!data) return redirect(`/pagos/historial`);

	return <InvoiceCard invoice={data} />;
}
