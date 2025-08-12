"use server";

import { fetchData } from "@/utils/fetchHandler";
import type { ChangePassword, User } from "@/utils/interfaces/user";
import bcrypt from "bcryptjs";

type EntityProp =
	| "representatives"
	| "athletes"
	| "users"
	| "health"
	| "repr-athletes"
	| "invoices"
	| "history"
	| "config";

export const getEntityData = async <T>(
	entity: EntityProp,
	query: string,
	params?: { [key: string]: string },
	forFormView = false,
	formAthlete = false,
): Promise<T | undefined> => {
	return await fetchData(
		`/api/${entity}/${query}${Object.keys(params ?? {}).length > 0 ? `?${new URLSearchParams(params).toString()}` : ""}`,
	);
};

export const setEntityData = async <T>(
	entity: EntityProp,
	data: Record<string, unknown>,
) => {
	return await fetchData<T>(`/api/${entity}`, {
		method: "POST",
		body: data,
	});
};

export const updateEntityData = async <T>(
	entity: EntityProp,
	query: string,
	data: Record<string, unknown>,
) => {
	return await fetchData<T>(`/api/${entity}/${query}`, {
		method: "PATCH",
		body: data,
	});
};

export const deleteEntityData = async (entity: EntityProp, query: string) => {
	return await fetchData(`/api/${entity}/${query}`, {
		method: "DELETE",
	});
};

export const changePassword = async (data: ChangePassword) => {
	if (!data.ci_number) throw { message: "ID no especificado" };

	if (data.password !== data.repeat_password)
		throw { message: "Contraseña no especificada" };

	const user = await getEntityData<User>("users", data.ci_number);

	if (!user) throw { message: "Usuario no encontrado" };

	if (!(await bcrypt.compare(data.restore_code, user.restore_code as string)))
		throw { message: "Código de restauración no válido" };

	const hash = await bcrypt.hash(data.password, 10);

	await updateEntityData("users", data.ci_number, {
		password: hash,
	});

	return { message: "Contraseña cambiada con éxito" };
};
