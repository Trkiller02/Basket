"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";

export function NavBreadcrumbs() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Split the pathname into segments and remove empty segments
	const segments = pathname.split("/").filter(Boolean);

	// Format a segment to make it more readable
	const formatSegment = (segment: string): string => {
		// Handle dynamic segments (those in square brackets)
		if (segment.startsWith("[") && segment.endsWith("]")) {
			const paramName = segment.slice(1, -1);
			return `${paramName.charAt(0).toUpperCase() + paramName.slice(1)}`;
		}

		// Replace hyphens and underscores with spaces
		const formatted = segment.replace(/[-_]/g, " ");

		return formatted.charAt(0).toUpperCase() + formatted.slice(1);
	};

	// Build the URL for a specific breadcrumb level
	const buildUrl = (index: number): string => {
		const segmentPath = `/${segments.slice(0, index + 1).join("/")}`;

		return searchParams.size > 0
			? `${segmentPath}?${searchParams.toString()}`
			: segmentPath;
	};

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{/* Home item */}
				<BreadcrumbItem>
					<BreadcrumbLink href="/" aria-label={"Home"}>
						<HomeIcon className="h-4 w-4" />
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />

				{/* Path segments */}
				{segments.map((segment, index) => {
					const isLastItem = index === segments.length - 1;
					const formattedSegment = formatSegment(segment);

					return (
						<BreadcrumbItem key={segment}>
							{isLastItem ? (
								<BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
							) : (
								<>
									<BreadcrumbLink href={buildUrl(index)}>
										{formattedSegment}
									</BreadcrumbLink>
									<BreadcrumbSeparator />
								</>
							)}
						</BreadcrumbItem>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
