import type { RegisterData } from "@/store/useRegisterStore";
import { MsgError } from "./messages";
import { REPRESENT_LIST } from "./selectList";
import { getEntityData } from "@/lib/action-data";
import type { User } from "./interfaces/user";

export const entitiesList = new Set(["representante", "usuario", "atleta"]);

export const adminEntitiesList = new Set(["secretaria", "administrador"]);

export const findEntity = async (id: string, registerData?: RegisterData) => {
	try {
		if (registerData) {
			[...REPRESENT_LIST, "athlete"].map((item) => {
				const prop = item as keyof Omit<RegisterData, "health" | "tutor">;

				if (typeof registerData[prop] === "object") {
					if (registerData[prop].user_id.ci_number === id) {
						throw new Error(`Esta C.I se encuentra asignado a ${prop}`);
					}
				}
			});
		}

		const response = await getEntityData<User>("users", id.toUpperCase());

		return response;
	} catch (error) {
		if ((error as Error).message === MsgError.NOT_FOUND) {
			throw {
				message: "Registro no encontrado",
				description: "Puede continuar con el registro.",
			};
		}

		throw {
			message: "Error al buscar registro",
			description: (error as Error).message,
		};
	}
};
