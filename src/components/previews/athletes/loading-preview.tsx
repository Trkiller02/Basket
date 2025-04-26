"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function LoadingAthletesPreview() {
	return (
		<section className="flex flex-row gap-2">
			{Array.from({ length: 6 }).map((_, id) => (
				<Card key={id.toString()} as="article">
					<CardHeader className="inline-flex gap-2 items-center">
						<div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-50 hover:bg-gray-100">
							<Skeleton className="w-full aspect-square h-auto text-foreground-700" />
						</div>
						<h1 className="text-2xl font-bold h-full w-32">
							<Skeleton className="h-5" /> <br />
							<Skeleton className="h-4 w-1/2" />
						</h1>
						<Skeleton className="self-start ml-2 h-4 rounded-xl" />
					</CardHeader>
					<CardBody>
						<ul aria-labelledby="personal-data" className="flex flex-col gap-2">
							<div className="grid grid-cols-2 gap-4">
								<li className="font-semibold text-foreground-700">
									<Skeleton className="h-4 w-full" />
								</li>
							</div>

							<li className="font-semibold text-foreground-700">
								<Skeleton className="h-4 w-full" />
							</li>
						</ul>
					</CardBody>
				</Card>
			))}
		</section>
	);
}
