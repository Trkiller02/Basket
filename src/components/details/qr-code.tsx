import QRCode from "react-qr-code";
import { Button } from "../ui/button";
import { memo } from "react";
import { Download, Info, UserLock } from "lucide-react";

interface DataQrProp {
	password: string;
	restore_code: string;
	name: string;
}

export const QRDetails = memo(({ data }: { data?: DataQrProp }) => {
	if (!data) return <h1>No hay datos para mostrar.</h1>;

	const downloadPDF = async () => {
		const response = await fetch("/api/reports/qr", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (!response.ok) return alert("Error al descargar el PDF");

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
		<article className="flex flex-col gap-2 justify-center items-center">
			<h1 className="text-2xl font-semibold flex items-center gap-2">
				<UserLock className="size-6" />
				Código de seguridad
			</h1>

			<div className="p-6 bg-gray-100 rounded-lg border-2 border-border">
				<QRCode
					value={
						data
							? `Hola, ${data.name} \n Recuperación: ${data.restore_code} \n ${data.password ? `Contraseña: ${data.password}` : ""}`
							: ""
					}
					id="qr-canvas"
				/>
			</div>
			<em className="text-sm text-gray-600 flex items-center gap-1">
				<Info className="size-4" />
				Guarde esto en un lugar seguro
			</em>
			<Button onClick={() => downloadPDF()} size="lg" className="gap-2">
				<Download className="h-4 w-4" />
				Descargar QR
			</Button>
		</article>
	);
});
