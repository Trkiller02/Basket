"use server";

import { fetchData } from "@/utils/fetchHandler";
import { auth } from "./auth";
import type { ChangePasswod, User } from "@/utils/interfaces/user";
import bcrypt from "bcryptjs";
import { NOTIFICATION_MSG, NOTIFICATION_TYPE } from "@/utils/typeNotifications";

export const getEntityData = async <T>(
	entity: "representatives" | "athletes" | "users",
	query: string,
	forFormView = false,
): Promise<T | undefined> => {
	return await fetchData(
		`/api/${entity}/${query}${forFormView ? "?formView=true" : ""}`,
	);
};

export const getEntityDataById = async <T>(
	entity: "health" | "repr-athletes",
	id: string,
	formAthlete = false,
) => {
	return await fetchData<T>(
		`/api/${entity}/${id}${formAthlete ? "?formAthlete=true" : ""}`,
	);
};

export const setEntityData = async <T>(
	entity:
		| "representatives"
		| "athletes"
		| "health"
		| "repr-athletes"
		| "invoices"
		| "notifications"
		| "configurations",
	data: Record<string, unknown>,
) => {
	return await fetchData<T>(`/api/${entity}`, {
		method: "POST",
		body: data,
	});
};

export const updateEntityData = async <T>(
	entity: "representatives" | "athletes" | "health",
	query: string,
	data: Record<string, unknown>,
) => {
	return await fetchData<T>(`/api/${entity}/${query}`, {
		method: "PATCH",
		body: data,
	});
};

export const deleteEntityData = async (
	entity: "representatives" | "athletes",
	query: string,
) => {
	return await fetchData(`/api/${entity}/${query}`, {
		method: "DELETE",
	});
};

export const changePassword = async (data: ChangePasswod) => {
	if (!data.ci_number) throw { message: "ID no especificado" };

	if (data.new_password !== data.repeat_password)
		throw { message: "Contraseña no especificada" };

	const user = await getEntityData<User>("users", data.ci_number);

	if (!user) throw { message: "Usuario no encontrado" };

	if (!(await bcrypt.compare(data.restore_code, user.restore_code)))
		throw { message: "Código de restauración no válido" };

	const ctx = await auth.$context;
	const hash = await ctx.password.hash(data.new_password);

	await ctx.internalAdapter.updatePassword(user.id, hash); //(you can also use your orm directly)

	await setEntityData("notifications", {
		user_id: user.id,
		description: NOTIFICATION_MSG.CHANGES,
		type: NOTIFICATION_TYPE.CHANGE,
	});

	return { message: "Contraseña cambiada con éxito" };
};
