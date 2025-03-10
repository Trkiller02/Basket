interface FetchData {
	method?: "DELETE" | "GET" | "POST" | "PATCH" | "PUT";
	body?: unknown;
	token?: string;
}

export const fetchData = async <T>(
	url: string,
	options: FetchData = { method: "GET" },
): Promise<T | undefined> => {
	const { method } = options;

	const response = await fetch(url, {
		method: method ?? "GET",
		body:
			!["GET", "DELETE"].includes(method ?? "GET") && options?.body
				? await JSON.stringify(options?.body)
				: undefined,
	});

	const data = await response.json();

	if (!response.ok) throw new Error(data.message);

	return data;
};
