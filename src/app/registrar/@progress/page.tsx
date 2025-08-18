"use client";

import { RowSteps } from "@/components/progress-register";
import { useRegisterStore } from "@/store/useRegisterStore";
import { usePathname } from "next/navigation";
import { use } from "react";

export default function PageProgress({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { etapa } = use(searchParams);
	const pathname = usePathname();
	const registerData = useRegisterStore((state) => state.registerData);

	if (pathname !== "/registrar") return null;

	return <RowSteps etapa={etapa ?? "atleta"} registerData={registerData} />;
}
