import LoginComponent from "@/components/auth/sign-in";
import UserForm from "@/components/auth/sign-up";
import RepresentSignin from "@/components/forms/represent-signin";

async function AuthPage({ params }: { params: { step: string } }) {
	const { step } = await params;

	if (step === "iniciar") return <LoginComponent />;

	if (step === "registrar") return <UserForm />;

	if (step === "completar") return <RepresentSignin />;

	return null;
}

export default AuthPage;
