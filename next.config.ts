import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		ppr: "incremental",
		optimizeCss: true,
		optimizePackageImports: ["@heroui/*"],
		nodeMiddleware: true,
		parallelServerCompiles: true,
		webpackBuildWorker: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
