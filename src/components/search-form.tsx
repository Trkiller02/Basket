"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { entitySelect } from "@/utils/selectList";

import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { cn } from "@heroui/theme";
import { Delete } from "lucide-react";

export default function SearchForm() {
	const params = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const entity = params.get("ent");
	const query = params.get("q");
	const deleted = params.get("deleted") === "true";

	const handleChange = useDebouncedCallback(
		({
			target: { name, value },
		}: {
			target: { name: string; value: string };
		}) => {
			const searchParams = new URLSearchParams(params);

			if (value) {
				if (searchParams.has(name)) {
					searchParams.set(name, value);

					if (name === "deleted" && value === "false")
						searchParams.delete("deleted");
				} else {
					searchParams.append(name, value);
				}
			} else {
				searchParams.delete(name);
			}

			replace(`${pathname}?${searchParams.toString()}`);
		},
		300,
	);

	/* const iconClasses =
		"text-xl text-default-500 pointer-events-none flex-shrink-0";
 */
	/* const exportData = async () => {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/tools/excel${params}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session?.user.token}`,
				},
			},
		);

		const blob = await res.blob();

		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");

		a.href = url;
		a.download = `${(entity ?? "").charAt(0).toUpperCase() + entity?.slice(1)}${stage ? stage.replace(" ", "") : ""}${level ?? ""}${section ?? ""}${query ?? ""}.xlsx`;
		a.click();

		window.URL.revokeObjectURL(url);
	}; */

	return (
		<section className="w-full flex justify-center items-center max-lg:w-full max-lg:p-0 my-4">
			<div className="grid grid-cols-4 gap-3 w-full">
				{/* ENTITY SELECT */}
				<Select
					name="ent"
					defaultSelectedKeys={entity ? [entity] : undefined}
					items={entitySelect}
					label="Entidad:"
					description="Seleccione una entidad."
					onChange={handleChange}
					isRequired
				>
					{(entity: {
						value: string;
						description?: string;
						label: string;
					}) => (
						<SelectItem key={entity.value} description={entity.description}>
							{entity.label}
						</SelectItem>
					)}
				</Select>

				<Input
					className={"col-span-2"}
					name="q"
					variant="bordered"
					label="C.I o Correo Electronico:"
					onChange={handleChange}
					defaultValue={query ?? undefined}
					isRequired={entity === "represent"}
				/>
				<Checkbox
					icon={(props) => {
						const {
							isSelected,
							isIndeterminate,
							disableAnimation,
							...otherProps
						} = props;

						return <Delete {...otherProps} />;
					}}
					defaultChecked={deleted}
					classNames={{
						icon: "h-3/4 w-auto aspect-square",
						wrapper: "w-8 h-auto aspect-square",
					}}
					name="deleted"
					title="Incluir registros eliminados."
					size="lg"
					onValueChange={(isValue) =>
						handleChange({
							target: { name: "deleted", value: String(isValue) },
						})
					}
				>
					<div className="flex flex-col gap-0">
						<p className="font-semibold text-base">Eliminados</p>
						<span className="text-sm text-default-500 text-pretty">
							Incluir registros eliminados.
						</span>
					</div>
				</Checkbox>
			</div>
		</section>
	);
}
