"use client";

import { LoginForm } from "@/components/auth/login-form";
import { notFound } from "next/navigation";
import { use } from "react";

function AuthPage({ params }: { params: Promise<{ step: string }> }) {
	const { step } = use(params);

	if (step === "iniciar") return <LoginForm />;

	if (step === "completar") return;

	if (step === "recuperar") return;

	return notFound();
}

export default AuthPage;
