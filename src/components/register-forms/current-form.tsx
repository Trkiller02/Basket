import { formEntities } from "@/utils/selectList";
import dynamic from "next/dynamic";
import { memo, Suspense } from "react";

const LazyAthleteForm = dynamic(
	() => import("@/components/register-forms/athlete"),
);
const LazyReprForm = dynamic(
	() => import("@/components/register-forms/representative"),
);
const LazyHealthForm = dynamic(
	() => import("@/components/register-forms/health"),
);
const LazyResumeForm = dynamic(
	() => import("@/components/register-forms/resume"),
);
const LazyModal = dynamic(
	() => import("@/components/register-forms/modal-representative"),
);

async function CurrentForm({
	etapa,
	modal,
}: { etapa: string; modal?: string }) {
	if (etapa === "atleta") return <LazyAthleteForm />;

	if (etapa === "salud") return <LazyHealthForm />;

	if (Array.from(formEntities).slice(2, 5).includes(etapa))
		return (
			<>
				<LazyReprForm etapa={etapa as "representante" | "madre" | "padre"} />
				{modal && <LazyModal etapa={etapa} open={modal === "true"} />}
			</>
		);

	if (etapa === "resumen")
		return (
			<Suspense fallback={<div>Loading...</div>}>
				<LazyResumeForm />
			</Suspense>
		);
}

export default memo(CurrentForm);
