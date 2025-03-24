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
				const res = await fetchData<Athlete[]>(
					`/api/athletes?${params.toString()}`,
				);

				if (res) {
					return Array.isArray(res)
						? res.map(extractPropsAthlete)
						: [extractPropsAthlete(res)];
				}
			}

			if (ent === "representante") {
				const res = await fetchData<Representative | Representative[]>(
					`/api/representatives?${params.toString()}`,
				);

				if (res)
					return Array.isArray(res)
						? res.map(extractPropsRepresentative)
						: [extractPropsRepresentative(res)];
			}

			const res = await fetchData(`/api/users?${params.toString()}`);
			if (res) return Array.isArray(res) ? res : [res];

			return [];
		} catch (error) {
			console.log((error as Error).message);
		}
	}
};
