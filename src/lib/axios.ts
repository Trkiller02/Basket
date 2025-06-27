import axios from "axios";

export const AxiosInstance = axios.create({
	baseURL: typeof window === "undefined" ? process.env.BACKEND_URL : "",
	timeout: 4000,
	headers: { "content-type": "application/json" },
});

export const fetcher = async <T>(
	url: string,
	args?: {
		method: "GET" | "POST" | "PATCH" | "DELETE";
		body?: Record<string, unknown>;
	},
): Promise<T> => {
	switch (args?.method) {
		case "POST":
			return await AxiosInstance.post(url, args.body).then((res) => res.data);
		case "PATCH":
			return await AxiosInstance.patch(url, args.body).then((res) => res.data);
		case "DELETE":
			return await AxiosInstance.delete(url).then((res) => res.data);
		default:
			return await AxiosInstance.get(url).then((res) => res.data);
	}
};
