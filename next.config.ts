import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		parallelServerCompiles: true,
		useLightningcss: true,
		ppr: "incremental",
	},
};

export default nextConfig;
