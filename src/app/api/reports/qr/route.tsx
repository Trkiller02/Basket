import { QrPDF } from "@/components/reports/qrcode";
import { renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

export const POST = async (req: Request) => {
	const data = await req.json();

	const dataUrl = await QRCode.toDataURL(
		`Hola, ${data.name} \n Recuperación: ${data.restore_code} \n ${data.password ? `Contraseña: ${data.password}` : ""}`,
	);

	const stream = await renderToStream(<QrPDF qrValue={dataUrl} />);

	return new NextResponse(stream as unknown as ReadableStream, {
		/* headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="factura_${id}.pdf"`,
            }, */
	});
};
