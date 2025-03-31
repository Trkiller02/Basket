"use client";

import { Skeleton } from "@heroui/skeleton";

export const FormSkeleton = () => {
	return (
		<section className="grid grid-cols-2 gap-3 w-full">
			<Skeleton className="w-1/4 h-10 rounded-2xl col-span-2" />
			<div className="inline-flex w-full justify-between gap-3">
				<Skeleton className="w-full h-14 rounded-2xl" />
				<Skeleton className="w-full h-14 rounded-2xl" />
			</div>
			<Skeleton className="w-full h-14 rounded-2xl" />
			{Array.from({ length: 5 }).map((_, i) => (
				<Skeleton key={i.toString()} className="w-full h-14 rounded-2xl" />
			))}
			<div className="inline-flex w-full justify-between gap-3">
				<Skeleton className="w-full h-14 rounded-2xl" />
				<Skeleton className="w-full h-14 rounded-2xl" />
			</div>
			<Skeleton className="w-full h-14 rounded-2xl col-span-2" />
			<div className="col-span-2 pt-2 flex justify-between">
				<Skeleton className="w-16 h-10 rounded-2xl" />
				<Skeleton className="w-16 h-10 rounded-2xl" />
			</div>
		</section>
	);
};
