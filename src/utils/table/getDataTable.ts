import {
	extractPropsRepresentative,
	extractPropsAthlete,
} from "./extractProps";
import { fetchData } from "../fetchHandler";
import type { Athlete, DataRequest } from "../interfaces/athlete";
import type { Representative } from "../interfaces/representative";

export const getDataTable = async (
	searchParams: Promise<{
		[key: string]: string | undefined;
	}>,
): Promise<DataRequest[] | undefined> => {
	// GENERAL SEARCH PARAMS
	const { ent, q, deleted, page } = await searchParams;
	// AextractPropsAthlete SEARCH PARAMS
	const { etp, s, n } = await searchParams;

	if ((ent && q) || (ent && etp && n)) {
		const params = new URLSearchParams();
		if (q) params.append("q", q);
		if (deleted) params.append("deleted", deleted);
		if (page) params.append("page", page);

		if (ent === "estudiante") {
			if (etp) params.append("etp", etp);
			if (n) params.append("n", n);
			if (s) params.append("s", s);

			const res = await fetchData<Athlete | Athlete[]>(
				`/athletes?${params.toString()}`,
			);

			if (res)
				return Array.isArray(res)
					? res.map(extractPropsAthlete)
					: [extractPropsAthlete(res)];
		}

		if (ent === "representante") {
			const res = await fetchData<Representative | Representative[]>(
				`/represent?${params.toString()}`,
			);

			if (res)
				return Array.isArray(res)
					? res.map(extractPropsRepresentative)
					: [extractPropsRepresentative(res)];
		}

		const res = await fetchData(`/user?${params.toString()}`);
		if (res) return Array.isArray(res) ? res : [res];
	}
};
