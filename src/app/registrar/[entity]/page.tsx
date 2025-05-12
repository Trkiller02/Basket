import { notFound } from "next/navigation";

export default async function registerDetailPage({
	params,
}: {
	params: Promise<{ entity: string }>;
}) {
	const { entity } = await params;

	if (!["representante", "atleta", "usuario"].includes(entity))
		return notFound();

	return <div>{entity}</div>;
}
