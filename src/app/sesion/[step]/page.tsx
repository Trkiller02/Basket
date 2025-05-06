import ChangePasswod from "@/components/auth/change-passwod";
import LoginComponent from "@/components/auth/sign-in";
import RepresentSignin from "@/components/forms/represent-signin";

async function AuthPage({ params }: { params: { step: string } }) {
	const { step } = await params;

	if (step === "iniciar") return <LoginComponent />;

	if (step === "completar") return <RepresentSignin />;

	if (step === "cambiar-contraseña") return <ChangePasswod />;
	return null;
}

export default AuthPage;
