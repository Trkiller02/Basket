import AthleteForm from "@/components/forms/athlete";
import HealthForm from "@/components/forms/health";
import RepresentativeForm from "@/components/forms/representative";
import { Button, ButtonGroup } from "@heroui/button";
import { redirect } from "next/navigation";

export default async function Page(props: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { etapa } = await props.searchParams;

	if (!etapa) return redirect("/registrar?etapa=atleta");

	return (
		<section className="flex flex-col items-center justify-center gap-4 p-4 w-full h-full self-center">
			{etapa === "atleta" && <AthleteForm />}
			{etapa === "salud" && <HealthForm />}
			{etapa === "representante" && <RepresentativeForm />}
			<div className="flex w-full justify-between">
				<Button type="button">Cancelar</Button>
				<ButtonGroup>
					<Button type="button" isDisabled={etapa === "atleta"}>
						Anterior
					</Button>
					<Button type="submit" form={`${etapa}-form`} color="primary">
						{etapa === "resumen" ? "Finalizar" : "Próximo"}
					</Button>
				</ButtonGroup>
			</div>
		</section>
	);
}
