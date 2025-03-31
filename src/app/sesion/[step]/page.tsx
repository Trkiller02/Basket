import LoginComponent from "@/components/auth/login";
import UserForm from "@/components/forms/user";

async function AuthPage({ params }: { params: { step: string } }) {
	const { step } = await params;

	if (step === "iniciar") return <LoginComponent />;

	if (step === "registrar") return <UserForm />;

	return null;
}

export default AuthPage;
