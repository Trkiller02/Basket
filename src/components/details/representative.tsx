"use client";

import type { Representative } from "@/utils/interfaces/representative";
import { Button } from "../ui/button";
import { Card, CardAction, CardContent, CardHeader } from "../ui/card";
import { Edit2 } from "lucide-react";
import { memo } from "react";
import Link from "next/link";

function RepresentativeResume({
	data,
	formView,
	entity,
}: { data: Representative; formView?: boolean; entity?: string }) {
	if (!data) return null;

	const { user_id, ...restData } = data;

	return (
		<Card className={formView ? "w-full bg-transparent shadow-none" : "w-1/2"}>
			<CardHeader className="flex flex-row justify-between">
				<div className="gap-2 items-center">
					<h1 className="text-2xl font-bold">
						{user_id.lastname}&nbsp;
						<span className="text-lg text-default-500 pt-1">
							{user_id.name}
						</span>
					</h1>
				</div>
				<CardAction>
					<Button variant="link" size="icon" asChild>
						<Link
							href={
								formView
									? `/registrar?etapa=${entity ?? "representante"}`
									: `/editar/representante/${data.id}`
							}
						>
							<Edit2 className="py-1" />
						</Link>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<ul aria-labelledby="personal-data" className="grid grid-cols-3">
					<li className="font-semibold text-foreground-700">
						Cedula de Identidad:{" "}
						<span className="font-normal">{user_id.ci_number}</span>
					</li>
					<li className="font-semibold text-foreground-700">
						Correo: <span className="font-normal">{user_id.email}</span>
					</li>
					<li className="font-semibold text-foreground-700">
						Telefono:{" "}
						<span className="font-normal">{user_id.phone_number}</span>
					</li>
					<li className="font-semibold text-foreground-700">
						Ocupación:{" "}
						<span className="font-normal">{restData.occupation}</span>
					</li>
				</ul>
			</CardContent>
		</Card>
	);
}

export default memo(RepresentativeResume);
