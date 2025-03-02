import AthleteForm from "@/components/athlete-form";
import HealthForm from "@/components/health-form";
import RepresentativeForm from "@/components/representative-form";

export default async function Page(props: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { step } = await props.searchParams;

	if (step === "athlete") {
		return (
			<section>
				<AthleteForm />
				<HealthForm />
			</section>
		);
	}

	return (
		<>
			<RepresentativeForm />
		</>
	);
}
