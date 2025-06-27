"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Database } from "lucide-react";
import { toast } from "sonner";

export function BackupButton() {
	const [isDownloading, setIsDownloading] = useState(false);
	const handleDownload = async () => {
		setIsDownloading(true);

		try {
			const response = await fetch("/api/backup");

			if (!response.ok) {
				throw new Error("Error al descargar el backup SQL");
			}

			// Obtener el contenido SQL
			const sqlContent = await response.text();

			// Crear blob con el contenido SQL
			const blob = new Blob([sqlContent], { type: "application/sql" });

			// Crear URL temporal para descarga
			const url = window.URL.createObjectURL(blob);

			// Crear elemento de descarga
			const a = document.createElement("a");
			a.href = url;
			a.download = `backup_${new Date().toISOString().split("T")[0]}.sql`;
			document.body.appendChild(a);
			a.click();

			// Limpiar
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			toast.success(
				<div className="flex items-center gap-2">
					<p className="text-sm font-medium">Backup SQL generado</p>
					<p className="text-sm text-muted-foreground">
						El backup en formato SQL se ha generado correctamente.
					</p>
				</div>,
			);
		} catch (error) {
			console.error("Error:", error);
			toast.error(
				<div className="flex items-center gap-2">
					<p className="text-sm font-medium">Error al generar el backup SQL</p>
					<p className="text-sm text-muted-foreground">
						No se pudo generar el backup en formato SQL.
					</p>
				</div>,
			);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<Button onClick={handleDownload} disabled={isDownloading} className="gap-2">
			{isDownloading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Database className="h-4 w-4" />
			)}
			{isDownloading ? "Generando SQL..." : "Descargar Backup SQL"}
		</Button>
	);
}
