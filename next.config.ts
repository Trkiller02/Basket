import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		parallelServerCompiles: true,
		useLightningcss: true,
	},
};

export default nextConfig;
