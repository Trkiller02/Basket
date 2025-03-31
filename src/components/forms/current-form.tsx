import { formEntities } from "@/utils/selectList";
import dynamic from "next/dynamic";
import { memo } from "react";

const LazyAthleteForm = dynamic(() => import("@/components/forms/athlete"));
const LazyReprForm = dynamic(() => import("@/components/forms/representative"));
const LazyHealthForm = dynamic(() => import("@/components/forms/health"));
const LazyResumeForm = dynamic(() => import("@/components/forms/resume"));
const LazyModal = dynamic(
	() => import("@/components/forms/modal-representative"),
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

	if (etapa === "resumen") return <LazyResumeForm />;
}

export default memo(CurrentForm);
