import { getEntityData } from "@/lib/action-data";
import { MsgError } from "@/utils/messages";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";

export async function UserValidation({ session }: { session: Session | null }) {
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
}
