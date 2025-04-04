import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		ppr: "incremental",
		optimizeCss: true,
		optimizePackageImports: ["@heroui/*"],
		nodeMiddleware: true,
	},
};

export default nextConfig;
