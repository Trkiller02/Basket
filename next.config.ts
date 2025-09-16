import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	compiler: {
		removeConsole: true,
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
