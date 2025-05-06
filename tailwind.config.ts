import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|autocomplete|avatar|breadcrumbs|button|card|checkbox|chip|date-picker|divider|dropdown|input|input-otp|link|modal|navbar|number-input|pagination|progress|select|skeleton|table|toast|popover|user|ripple|spinner|form|listbox|scroll-shadow|calendar|date-input|menu|spacer).js"
  ],
	plugins: [heroui()],
} satisfies Config;
