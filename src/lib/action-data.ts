import { fetchData } from "@/utils/fetchHandler";

export const getEntityData = async (
	entity: "representatives" | "athletes",
	query: string,
) => {
	return await fetchData(`/api/${entity}/${query}`);
};

export const setEntityData = async <T>(
	entity: "representatives" | "athletes" | "health" | "repr-athletes",
	data: Record<string, unknown>,
) => {
	return await fetchData<T>(`/api/${entity}`, {
		method: "POST",
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
