import { fetchData } from "../fetchHandler";
import type { UserTable } from "../interfaces/athlete";
import { ExtractUserProps } from "./extractProps";

interface GetDataTableParams {
	searchParams: Record<string, string | undefined>;
	reprId?: string;
}

export const getEntityToFetch = (entity: string) =>
	entity === "atleta"
		? "athletes"
		: entity === "representante"
			? "representatives"
			: "users";

export const getDataTable = async ({
	searchParams,
	reprId,
}: GetDataTableParams): Promise<UserTable[]> => {
	// GENERAL SEARCH PARAMS
	const { ent = "usuarios", q, e, p } = searchParams;

	if (reprId)
		return (
			(
				await fetchData<{ result?: UserTable[] }>(
					`/api/repr-athletes/${reprId}?table=true`,
				)
			)?.result ?? []
		);

	const params = new URLSearchParams();
	if (q) params.append("query", q);
	if (e) params.append("deleted", e);
	if (p) params.append("page", p);

	const res = await fetchData<{ result: UserTable[] }>(
		`/api/${getEntityToFetch(ent)}?${params.toString()}`,
	);

	if (!res) return [];

	return Array.isArray(res.result)
		? res.result.map(ExtractUserProps)
		: [ExtractUserProps(res.result)];
};
