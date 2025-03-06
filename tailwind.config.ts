import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/components/(button|card|checkbox|chip|date-picker|dropdown|input|input-otp|modal|number-input|pagination|progress|select|skeleton|table|toast|popover|user|ripple|spinner|form|calendar|date-input|menu|divider|listbox|scroll-shadow|spacer|avatar).js",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
		},
	},
	plugins: [heroui()],
} satisfies Config;
