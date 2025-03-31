"use client";

import React from "react";
import RowSteps from "@/components/progress-register";

export default function PageProgress({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { etapa } = React.use(searchParams);
	return <RowSteps etapa={etapa ?? "atleta"} />;
}
