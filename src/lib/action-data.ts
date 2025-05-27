"use server";

import { fetchData } from "@/utils/fetchHandler";
import type { ChangePasswod, User } from "@/utils/interfaces/user";
import bcrypt from "bcryptjs";
import { NOTIFICATION_MSG, NOTIFICATION_TYPE } from "@/utils/typeNotifications";
import { AxiosInstance } from "./axios";

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
		| "configurations"
		| "users",
	data: Record<string, unknown>,
) => {
	return await fetchData<T>(`/api/${entity}`, {
		method: "POST",
		body: data,
	});
};

export const updateEntityData = async <T>(
	entity: "representatives" | "athletes" | "health" | "users",
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
	if (!data.ci_number) throw new Error("ID no especificado");

	if (data.new_password !== data.repeat_password)
		throw new Error("Contraseña no especificada");

	const user = await getEntityData<User>("users", data.ci_number);

	if (!user) throw new Error("Usuario no encontrado");

	if (!(await bcrypt.compare(data.restore_code, user.restore_code)))
		throw new Error("Código de restauración no válido");

	const hash = await bcrypt.hash(data.new_password, 10);

	await fetchData(`/api/users/${user.id}`, {
		method: "PATCH",
		body: { password: hash },
	});

	await setEntityData("notifications", {
		user_id: user.id,
		description: NOTIFICATION_MSG.CHANGES,
		type: NOTIFICATION_TYPE.CHANGE,
	});

	return { message: "Contraseña cambiada con éxito" };
};

export const fetcher = async (
	url: string,
	args?: {
		method: "GET" | "POST" | "PATCH" | "DELETE";
		body?: Record<string, unknown>;
	},
) => {
	switch (args?.method) {
		case "POST":
			return await AxiosInstance.post(url, args.body);
		case "PATCH":
			return await AxiosInstance.patch(url, args.body);
		case "DELETE":
			return await AxiosInstance.delete(url);
		default:
			return await AxiosInstance.get(url);
	}
};
