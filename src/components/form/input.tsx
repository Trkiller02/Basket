"use client";
import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function InputForm({
	name,
	label,
	description,
	placeholder,
	...props
}: React.ComponentProps<"input"> & { label: string; description?: string }) {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name={name || ""}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input placeholder={placeholder} {...field} {...props} />
					</FormControl>
					<FormDescription>{description}</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
