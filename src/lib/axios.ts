import axios from "axios";

export const AxiosInstance = axios.create({
	baseURL: `${process.env.BASE_URL}/api/`,
	timeout: 4000,
	headers: { "content-type": "application/json" },
});
