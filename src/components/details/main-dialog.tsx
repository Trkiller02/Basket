"use client";

/* 
import QRCode from "react-qr-code";
import { Button } from "../ui/button";
import { useState } from "react";

export default function DialogSecurity({
	data,
}: {
	data?: { password: string; restore_code: string; name: string };
}) {
	const [open, setOpen] = useState(!!open);

	const downloadPDF = async () => {
		const response = await fetch("/api/reports/qr", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (!response.ok) {
			alert("Error al descargar el PDF");
			return;
		}

		const blob = await response?.blob();

		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `seguridad_${data?.name}.pdf`;
		document.body.appendChild(link);
		link.click();

		// Limpiar
		window.URL.revokeObjectURL(url);
		document.body.removeChild(link);
	};

	return (
		<Dialog open={open} onOpenChange={() => setOpen(!open)}>
			<DialogContent>
				<DialogHeader className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold">
						Código de seguridad
						<span className="text-sm text-default-500 block">
							Guarde esto en un lugar seguro
						</span>
					</h1>
				</DialogHeader>
				<div className="flex items-center justify-center">
					<QRCode
						value={
							data
								? `Hola, ${data.name} \n Recuperación: ${data.restore_code} \n ${data.password ? `Contraseña: ${data.password}` : ""}`
								: ""
						}
						id="qr-canvas"
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={"ghost"}>Cerrar</Button>
					</DialogClose>
					<Button onClick={() => downloadPDF()}>Imprimir</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
 */

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import React, { useState } from "react";
import { Separator } from "../ui/separator";

interface DynamicProps {
	title?: string;
	description?: string;
	children: React.ReactNode;
	onAction?: () => void;
}

export function MainDialog({
	title = "¡Importante!",
	description = "Esta información puede ser importante y confidencial.",
	onAction,
	children,
}: DynamicProps) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();
	const isOpen = !!searchParams.get("modal");

	const onOpenChange = async () => {
		const params = new URLSearchParams(searchParams);
		params.delete("modal");
		replace(`${pathname}${params.size > 0 ? `?${params.toString()}` : ""}`);

		onAction?.();
	};

	// Filtrar children válidos (no null, undefined, etc.)
	const validChildren = React.Children.toArray(children).filter(Boolean);
	const childrenCount = validChildren.length;

	// Determinar el layout basado en la cantidad de hijos
	const getLayoutClasses = () => {
		switch (childrenCount) {
			case 0:
				return "";
			case 1:
				return "w-full";
			case 2:
				return "grid grid-cols-1 md:grid-cols-2 gap-4";
			default:
				// Para más de 2 hijos, usar grid responsive
				return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
		}
	};

	/* const getMaxWidthClass = () => {
		const widthMap = {
			sm: "sm:max-w-sm",
			md: "sm:max-w-md",
			lg: "sm:max-w-lg",
			xl: "sm:max-w-xl",
			"2xl": "sm:max-w-2xl",
			full: "sm:max-w-full",
		};
		return widthMap[maxWidth];
	}; */

	const modalContent = (
		<DialogContent
			className={`${childrenCount > 1 ? "sm:max-w-[70vw]" : "sm:max-w-lg"} max-h-[90vh] overflow-y-auto`}
			onInteractOutside={(e) => e.preventDefault()}
			onEscapeKeyDown={(e) => e.preventDefault()}
			onPointerDownOutside={(e) => e.preventDefault()}
		>
			{/* Cabecera */}
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>

			<div className={`${getLayoutClasses()} py-2`}>
				{childrenCount === 0 ? (
					<p className="text-center text-gray-500 py-8">
						No hay contenido para mostrar
					</p>
				) : (
					validChildren.map((child, index) => (
						<div key={index.toString()} className="w-full relative">
							{child}
							{index < validChildren.length - 1 && (
								<Separator className="my-4 md:hidden absolute bottom-0" />
							)}

							{index < validChildren.length - 1 && (
								<Separator
									className="my-4 max-sm:hidden absolute right-4 top-0"
									orientation="vertical"
								/>
							)}
						</div>
					))
				)}
			</div>
		</DialogContent>
	);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange} modal>
			{modalContent}
		</Dialog>
	);
}
