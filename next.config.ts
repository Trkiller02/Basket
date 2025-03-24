import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		ppr: "incremental",
		optimizeCss: true,
		optimizePackageImports: ["@heroui/*"],
	},
};

export default nextConfig;
