import {
	Document,
	Page,
	Text,
	View,
	Image,
	StyleSheet,
} from "@react-pdf/renderer";
import QRCode from "react-qr-code";

// Define styles for the PDF document
const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		padding: 30,
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1,
		textAlign: "center",
	},
	qrContainer: {
		width: 150, // Fixed width for the QR code image in PDF
		height: 150, // Fixed height for the QR code image in PDF
		marginVertical: 20,
		alignSelf: "center", // Center the QR code in the PDF
	},
	heading: {
		fontSize: 24,
		marginBottom: 10,
		// Using a common font
	},
	paragraph: {
		fontSize: 12,
		marginVertical: 5,
	},
});

// A component to render the QR code and convert it to a data URL
/* const QRCodeImage = ({
	value,
}: { value: { name: string; password: string; restore_code: string } }) => {
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

	useEffect(() => {
		const generateQrCodeImage = async () => {
			try {
				// Create a temporary div to render the QRCode component
				// This is a common workaround when a component renders directly to SVG/Canvas
				const svgElement = document.createElement("div");
				// We need to render the QRCode component to this temporary div
				// For a browser environment, we can't directly use renderToString here
				// Instead, we'll manually create the SVG content or use a library that gives SVG string directly.
				// For 'react-qr-code', it renders an SVG element directly.
				// We can create an SVG element and then use its outerHTML.

				// A more robust way is to use a canvas to draw the QR code and then get its data URL.
				// This avoids DOM manipulation and potential issues with SVG rendering differences.

				const canvas = document.createElement("canvas");
				QRCode.toCanvas(
					canvas,
					`Hola, ${qrValue.name} \n Recuperación: ${qrValue.restore_code} \n ${qrValue.password ? `Contraseña: ${qrValue.password}` : ""}`,
					{
						width: 256, // Set a reasonable size for the canvas
					},
					(error?: Error | null) => {
						if (error) {
							console.error("Error generating QR code on canvas:", error);
							setQrCodeDataUrl(null);
						} else {
							setQrCodeDataUrl(canvas?.toDataURL("image/png")); // Get PNG data URL
						}
					},
				);
			} catch (error) {
				console.error("Error generating QR code data URL:", error);
				setQrCodeDataUrl(null);
			}
		};

		if (value) {
			generateQrCodeImage();
		}
	}, [value]); // Re-generate if the value changes

	if (!qrCodeDataUrl) {
		return <Text>Generating QR code...</Text>; // Or a loading indicator
	}

	return <Image src={qrCodeDataUrl} style={styles.qrContainer} />;
};
 */
// The main PDF document component

export const QrPDF = ({ qrValue }: { qrValue: string }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.section}>
				<Text style={styles.heading}>
					Escuela Formativa de Baloncesto "Trapichito"
				</Text>
				<Text style={styles.paragraph}>
					Almacene su código de seguridad en un lugar seguro, procure no
					eliminarlo.
				</Text>
				<Text style={styles.paragraph}>
					Escanee el código QR con su teléfono para acceder a la información.
				</Text>
				{/* Render the QR code image component */}
				<Image src={qrValue} />

				<Text style={styles.paragraph}>
					Si tiene dudas o necesita ayuda, no dude en contactar con nosotros.
				</Text>
			</View>
		</Page>
	</Document>
);
