import { FormSkeleton } from "@/components/skeletons/forms";
import FormButtons from "@/components/forms/buttons";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { formEntities } from "@/utils/selectList";
import { FormWrapper } from "@/components/forms/form-wrapper";
import CurrentForm from "@/components/forms/current-form";

export const experimental_ppr = true;

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { etapa, modal } = await searchParams;

	if (!etapa) return redirect("/registrar?etapa=atleta");

	if (!formEntities.has(etapa)) return notFound();

	return (
		<div className="flex flex-col gap-4 p-4 w-full shadow-md bg-content1 rounded-2xl border-2 border-content2">
			<h1 className="font-semibold text-3xl">
				Formulario <span className="text-primary">|</span>{" "}
				{etapa.charAt(0).toUpperCase() + etapa.slice(1)}
			</h1>
			<FormWrapper>
				<Suspense fallback={<FormSkeleton />} key={etapa}>
					<CurrentForm etapa={etapa} modal={modal} />
					<FormButtons etapa={etapa} />
				</Suspense>
			</FormWrapper>
		</div>
	);
}
