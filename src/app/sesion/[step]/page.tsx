"use client";

import ChangePassword from "@/components/auth/change-password";
import LoginComponent from "@/components/auth/sign-in";
import RepresentSignin from "@/components/forms/represent-signin";
import { notFound } from "next/navigation";
import { use } from "react";

function AuthPage({ params }: { params: Promise<{ step: string }> }) {
	const { step } = use(params);

	if (step === "iniciar") return <LoginComponent />;

	if (step === "completar") return <RepresentSignin />;

	if (step === "recuperar") return <ChangePassword />;

	return notFound();
}

export default AuthPage;
