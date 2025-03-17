"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { getItems } from "@/utils/get-items-path";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

export function BreadcrumbsList() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const entidad = searchParams.get("ent");
	const etapa = searchParams.get("etapa");

	const listItem = getItems(pathname, { entidad, etapa });
	return (
		<Breadcrumbs>
			{listItem.map(({ href, label }: { href: string; label: string }, i) => (
				<BreadcrumbItem
					key={i.toString()}
					href={href}
					isCurrent={pathname === href}
					className={`text-foreground-800 ${pathname === href ? "font-bold" : "font-semibold"} text-lg`}
				>
					{label}
				</BreadcrumbItem>
			))}
		</Breadcrumbs>
	);
}
