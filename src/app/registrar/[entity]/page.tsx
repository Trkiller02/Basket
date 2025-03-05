import { notFound } from "next/navigation";

export default async function registerDetailPage(props: {
	params: Promise<string>;
}) {
	const step = await props.params;

	if (!["representante", "atleta", "usuario"].includes(step)) notFound();

	return <div>page</div>;
}
