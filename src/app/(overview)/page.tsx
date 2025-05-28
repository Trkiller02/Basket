import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
	const session = await auth();

	// if (!session) return redirect("/sesion/iniciar");

	return (
		<div className="space-y-1">
			<h1 className="text-2xl font-semibold">
				¡Hola{session?.user?.name ? `, ${session.user.name}` : ""}!
			</h1>
			<p className="text-sm text-muted-foreground">
				{session?.user?.role === "representative"
					? "Estos son los atletas que tienes registrados en la institución:"
					: "Aquí puedes buscar y examinar los registros de los Atletas dentro de la institución."}
			</p>
		</div>
	);
};

export default Page;
