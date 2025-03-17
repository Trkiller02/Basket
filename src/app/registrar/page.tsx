import { FormSkeleton } from "@/components/skeletons/forms";
import { FormButtons } from "@/components/forms/buttons";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { formEntities } from "@/utils/selectList";
import { FormWrapper } from "@/components/forms/form-wrapper";
import { RowSteps } from "@/components/progress-register";

const LazyAthleteForm = dynamic(() => import("@/components/forms/athlete"));
const LazyReprForm = dynamic(() => import("@/components/forms/representative"));
const LazyHealthForm = dynamic(() => import("@/components/forms/health"));
const LazyResumeForm = dynamic(() => import("@/components/forms/resume"));

export default async function Page(props: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { etapa } = await props.searchParams;

	if (!etapa) return redirect("/registrar?etapa=atleta");

	if (!formEntities.has(etapa)) return notFound();

	return (
		<section className="flex flex-row gap-4 w-full">
			<div className="flex flex-col p-6 gap-6 w-3/4 shadow-md bg-content1 rounded-2xl border-2 border-content2 justify-around">
				<Suspense fallback={<FormSkeleton />} key={etapa}>
					<FormWrapper>
						<h1 className="font-semibold text-3xl">
							Formulario <span className="text-primary">|</span>{" "}
							{etapa.charAt(0).toUpperCase() + etapa.slice(1)}
						</h1>
						{etapa === "atleta" && <LazyAthleteForm />}
						{etapa === "salud" && <LazyHealthForm />}
						{Array.from(formEntities).slice(2, 5).includes(etapa) && (
							<LazyReprForm
								etapa={etapa as "representante" | "madre" | "padre"}
							/>
						)}
						{etapa === "resumen" && <LazyResumeForm />}
					</FormWrapper>
				</Suspense>
				<FormButtons etapa={etapa} />
			</div>
			<RowSteps etapa={etapa} />
		</section>
	);
}
