"use client";

import { Skeleton } from "@heroui/skeleton";

export default function StadisticsLoading() {
	return (
		<article className="rounded-2xl shadow-md h-1/4 grid grid-cols-3 gap-4">
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					className="flex flex-row items-center justify-center"
					key={i.toString()}
				>
					<Skeleton className="aspect-square h-12 w-auto rounded-full" />
					<div className="flex flex-col gap-2 w-full">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				</div>
			))}
		</article>
	);
}
