"use client";

import React from "react";
import RowSteps from "@/components/progress-register";
import { useRegisterStore } from "@/store/useRegisterStore";

export default function PageProgress({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { etapa } = React.use(searchParams);
	const registerData = useRegisterStore((state) => state.registerData);

	return <RowSteps etapa={etapa ?? "atleta"} registerData={registerData} />;
}
