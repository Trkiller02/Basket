import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const LazyLoginForm = dynamic(() =>
	import("@/components/auth/login-form").then((mod) => mod.LoginForm),
);
const LazyFillEntity = dynamic(() =>
	import("@/components/auth/fill-entity").then((mod) => mod.FillEntity),
);

const LazyRestorePassword = dynamic(() =>
	import("@/components/auth/restore-password").then(
		(mod) => mod.RestorePassword,
	),
);

const LazyValidateUser = dynamic(() =>
	import("@/components/auth/user-validation").then((mod) => mod.UserValidation),
);

async function AuthPage({ params }: { params: Promise<{ step: string }> }) {
	const { step } = await params;

	if (step === "iniciar") return <LazyLoginForm />;

	if (step === "completar") return <LazyFillEntity />;

	if (step === "recuperar") return <LazyRestorePassword />;

	if (step === "validar") return <LazyValidateUser />;

	return notFound();
}

export default AuthPage;
