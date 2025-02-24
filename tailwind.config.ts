import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/components/(button|card|chip|date-picker|dropdown|input|input-otp|modal|number-input|pagination|select|table|popover|user|ripple|spinner|calendar|date-input|form|menu|divider|listbox|scroll-shadow|checkbox|spacer|avatar).js",
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
