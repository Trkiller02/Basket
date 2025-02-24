import AthleteForm from "@/components/athlete-form";

export default async function Page(props: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const searchParams = await props.searchParams;

	return (
		<>
			<h1>Registrar</h1>
			<AthleteForm />
		</>
	);
}
