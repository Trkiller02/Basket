import {
	extractPropsRepresentative,
	extractPropsAthlete,
} from "./extractProps";
import { fetchData } from "../fetchHandler";
import type { Athlete, DataRequest } from "../interfaces/athlete";
import type { Representative } from "../interfaces/representative";

export const getDataTable = async (searchParams: {
	[key: string]: string | undefined;
}): Promise<DataRequest[] | undefined> => {
	// GENERAL SEARCH PARAMS
	const { ent, q, eliminados, page } = searchParams;

	if (ent && q) {
		const params = new URLSearchParams();
		if (q) params.append("query", q);
		if (eliminados) params.append("deleted", eliminados);
		if (page) params.append("page", page);

		try {
			if (ent === "atleta") {
				const res = await fetchData<{ result: Athlete[] }>(
					`/api/athletes?${params.toString()}`,
				);

				if (res) {
					return Array.isArray(res.result)
						? res.result.map(extractPropsAthlete)
						: [extractPropsAthlete(res.result)];
				}
			}

			if (ent === "representante") {
				const res = await fetchData<{ result: Representative[] }>(
					`/api/representatives?${params.toString()}`,
				);

				if (res)
					return Array.isArray(res.result)
						? res.result.map(extractPropsRepresentative)
						: [extractPropsRepresentative(res.result)];
			}

			const res = await fetchData(`/api/users?${params.toString()}`);
			if (res) return Array.isArray(res) ? res : [res];

			return [];
		} catch (error) {
			console.log((error as Error).message);
		}
	}
};
