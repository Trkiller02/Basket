interface FetchData {
	method?: "DELETE" | "GET" | "POST" | "PATCH" | "PUT";
	body?: unknown;
	token?: string;
}

export const fetchData = async <T>(
	url: string,
	options: FetchData = { method: "GET" },
): Promise<T | undefined> => {
	const { method, token } = options;

	const headers = new Headers();
	headers.append("Content-Type", "application/json");

	if (token) headers.append("Authorization", `Bearer ${token}`);

	try {
		const response = await fetch(process.env.BACKEND_URL + url, {
			method: method ?? "GET",
			body:
				!["GET", "DELETE"].includes(method ?? "GET") && options?.body
					? await JSON.stringify(options?.body)
					: undefined,
			headers,
		});

		const data = await response.json();

		if (!response.ok) throw new Error(data.message);

		return data;
	} catch (error) {
		console.log(error);
	}
};
