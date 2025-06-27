"use client";

import { RowSteps } from "@/components/progress-register";
import { useRegisterStore } from "@/store/useRegisterStore";
import { use } from "react";

export default function PageProgress({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { etapa } = use(searchParams);
	const registerData = useRegisterStore((state) => state.registerData);

	return <RowSteps etapa={etapa ?? "atleta"} registerData={registerData} />;
}
