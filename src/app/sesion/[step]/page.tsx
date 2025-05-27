import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { auth } from "@/auth";

const LazyLoginComponent = dynamic(() => import("@/components/auth/sign-in"));
const LazyRepresentSignin = dynamic(
	() => import("@/components/forms/represent-signin"),
);
const LazyChangePassword = dynamic(
	() => import("@/components/auth/change-password"),
);

async function AuthPage({ params }: { params: Promise<{ step: string }> }) {
	const { step } = await params;
	const session = auth();

	if (step === "iniciar") return <LazyLoginComponent />;

	if (step === "completar")
		return <LazyRepresentSignin sessionData={session} />;

	if (step === "recuperar") return <LazyChangePassword />;

	return notFound();
}

export default AuthPage;
