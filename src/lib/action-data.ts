import { fetchData } from "@/utils/fetchHandler";

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
		| "invoices",
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
