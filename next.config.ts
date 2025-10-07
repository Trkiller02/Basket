import type { NextConfig } from "next";
process.loadEnvFile();

const nextConfig: NextConfig = {
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	/* config options here */
	experimental: {
		parallelServerCompiles: true,
		nodeMiddleware: true,
		ppr: "incremental",
		globalNotFound: true,
	},
};

export default nextConfig;
