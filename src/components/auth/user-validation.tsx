import { auth } from "@/auth";
import { getEntityData } from "@/lib/action-data";
import { MsgError } from "@/utils/messages";
import { redirect } from "next/navigation";

export async function UserValidation() {
	const session = await auth();

	if (session?.user?.role === "representante") {
		try {
			const user = await getEntityData(
				"representatives",
				session?.user.ci_number,
				{
					formView: "true",
				},
			);

			if (user) return redirect("/");
		} catch (error) {
			if ((error as Error).message === MsgError.NOT_FOUND)
				return redirect("/sesion/completar");

			return redirect("/sesion/iniciar");
		}
	}

	return redirect("/");
}
