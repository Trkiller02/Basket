"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export const PDFPreview = ({ urlDownload }: { urlDownload: string }) => {
	const downloadPDF = async () => {
		const response = await fetch(urlDownload, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) return alert("Error al descargar el PDF");

		const blob = await response?.blob();

		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `planilla_${Date.now()}.pdf`;
		document.body.appendChild(link);
		link.click();

		// Limpiar
		window.URL.revokeObjectURL(url);
		document.body.removeChild(link);
	};

	return (
		<article>
			<div className="pb-4">
				<h1 className="flex items-center gap-2 text-xl font-bold">
					<FileText className="h-5 w-5" />
					Se ha generado un documento.
				</h1>
				<p className="text-gray-500 text-pretty">
					Haz clic en descargar para obtener el archivo completo.
				</p>
			</div>

			{/* PDF Placeholder */}
			<div className="border rounded-lg bg-gray-50 overflow-hidden">
				{/* PDF Viewer Header */}
				<div className="bg-gray-100 border-b px-4 py-2 flex items-center justify-between">
					<span className="text-sm text-gray-600">
						planilla_{Date.now()}.pdf
					</span>
					<Button onClick={() => {}} size="sm" className="gap-2">
						<Download className="h-4 w-4" />
						Descargar
					</Button>
				</div>

				{/* PDF Content Placeholder */}
				<div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
					{/* Página 1 */}
					<div className="bg-white border shadow-sm rounded p-6 mx-auto max-w-2xl">
						<div className="space-y-4">
							<div className="h-8 bg-gray-200 rounded w-3/4" />
							<div className="space-y-2">
								<div className="h-4 bg-gray-100 rounded" />
								<div className="h-4 bg-gray-100 rounded w-5/6" />
								<div className="h-4 bg-gray-100 rounded w-4/6" />
							</div>
							<div className="space-y-2 mt-6">
								<div className="h-4 bg-gray-100 rounded w-5/6" />
								<div className="h-4 bg-gray-100 rounded w-3/4" />
								<div className="h-4 bg-gray-100 rounded w-4/5" />
							</div>
							<div className="mt-8 space-y-2">
								<div className="h-4 bg-gray-100 rounded w-2/3" />
								<div className="h-4 bg-gray-100 rounded" />
							</div>
						</div>
						<div className="text-center text-xs text-gray-400 mt-8">
							Página 1
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};
