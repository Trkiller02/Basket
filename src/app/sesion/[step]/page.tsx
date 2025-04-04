import LoginComponent from "@/components/auth/sign-in";
import UserForm from "@/components/auth/sign-up";

async function AuthPage({ params }: { params: { step: string } }) {
	const { step } = await params;

	if (step === "iniciar") return <LoginComponent />;

	if (step === "registrar") return <UserForm />;

	return null;
}

export default AuthPage;
