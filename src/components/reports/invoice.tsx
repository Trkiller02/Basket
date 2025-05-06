import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
} from "@react-pdf/renderer";
import type { Invoices } from "@/utils/interfaces/invoice";
import type { Representative } from "@/utils/interfaces/representative";
import type { Athlete } from "@/utils/interfaces/athlete";

// Sample invoice data
interface InvoiceData {
	representative_id?: Representative;
	invoices: Invoices[];
	athletes: Athlete[];
	price: number;
}

// Create styles
const styles = StyleSheet.create({
	page: {
		padding: 30,
		fontFamily: "Helvetica",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
		paddingBottom: 10,
		borderBottom: "1px solid #1e3a8a",
	},
	headerLeft: {
		flexDirection: "column",
	},
	headerRight: {
		flexDirection: "column",
		alignItems: "flex-end",
	},
	logo: {
		width: 40,
		height: 40,
	},
	companyName: {
		fontSize: 12,
		fontWeight: "bold",
		marginTop: 5,
	},
	companyWebsite: {
		fontSize: 8,
		color: "#666",
	},
	invoiceTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginTop: 20,
		marginBottom: 20,
	},
	invoiceNumber: {
		fontSize: 10,
	},
	invoiceDate: {
		fontSize: 10,
	},
	clientInfo: {
		marginBottom: 20,
	},
	clientName: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 5,
	},
	clientDetail: {
		fontSize: 10,
		marginBottom: 3,
	},
	table: {
		display: "flex",
		width: "auto",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#bfbfbf",
		borderRightWidth: 0,
		borderBottomWidth: 0,
	},
	tableRow: {
		flexDirection: "row",
	},
	tableColHeader: {
		fontSize: 14,
		width: "30%",
		borderStyle: "solid",
		borderBottomColor: "#bfbfbf",
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderRightColor: "#bfbfbf",
		backgroundColor: "#f0f0f0",
		padding: 5,
	},
	tableColQuantity: {
		fontSize: 13,
		width: "25%",
		borderStyle: "solid",
		borderBottomColor: "#bfbfbf",
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderRightColor: "#bfbfbf",
		backgroundColor: "#f0f0f0",
		padding: 5,
	},
	tableColPrice: {
		fontSize: 14,
		width: "25%",
		borderStyle: "solid",
		borderBottomColor: "#bfbfbf",
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderRightColor: "#bfbfbf",
		backgroundColor: "#f0f0f0",
		padding: 5,
	},
	tableColTotal: {
		fontSize: 14,
		width: "20%",
		borderStyle: "solid",
		borderBottomColor: "#bfbfbf",
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderRightColor: "#bfbfbf",
		backgroundColor: "#f0f0f0",
		padding: 5,

		textAlign: "right",
	},
	tableCell: {
		width: "30%",
		borderStyle: "solid",
		borderBottomColor: "#bfbfbf",
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderRightColor: "#bfbfbf",
		padding: 5,
		fontSize: 12,
	},
	tableCellQuantity: {
		width: "25%",
		borderStyle: "solid",
		borderBottomColor: "#bfbfbf",
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderRightColor: "#bfbfbf",
		padding: 5,
		textAlign: "center",
	},
	tableCellPrice: {
		width: "25%",
		borderStyle: "solid",
		borderBottomColor: "#bfbfbf",
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderRightColor: "#bfbfbf",
		padding: 5,
		textAlign: "right",
	},
	tableCellTotal: {
		width: "20%",
		borderStyle: "solid",
		borderBottomColor: "#bfbfbf",
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderRightColor: "#bfbfbf",
		padding: 5,
		textAlign: "right",
	},
	tableCellDate: {
		width: "20%",
		borderStyle: "solid",
		borderBottomColor: "#bfbfbf",
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderRightColor: "#bfbfbf",
		padding: 5,
		textAlign: "right",
		fontSize: 12,
	},
	summaryContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 10,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "30%",
	},
	summaryTitle: {
		fontSize: 10,
		fontWeight: "bold",
		textAlign: "right",
	},
	summaryValue: {
		fontSize: 10,
		textAlign: "right",
	},
	totalContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 10,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "30%",
		borderTopWidth: 1,
		borderTopColor: "#bfbfbf",
		paddingTop: 5,
	},
	totalTitle: {
		fontSize: 12,
		fontWeight: "bold",
		textAlign: "right",
	},
	totalValue: {
		fontSize: 12,
		fontWeight: "bold",
		textAlign: "right",
	},
	paymentDetails: {
		marginTop: 40,
	},
	paymentTitle: {
		fontSize: 12,
		fontWeight: "bold",
		marginBottom: 5,
	},
	paymentInfo: {
		fontSize: 10,
		marginBottom: 3,
	},
	headerBar: {
		height: 20,
		backgroundColor: "#1e3a8a",
		marginBottom: 10,
		width: "100%",
	},
});

// Create Document Component
export const InvoicePDF = ({ invoiceData }: { invoiceData: InvoiceData }) => {
	const { representative_id, athletes, price } = invoiceData;

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.headerBar} />

				{/* Header */}
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Image
								src={`${process.cwd()}/public/trapiche.png`}
								style={styles.logo}
							/>
							<Text style={styles.companyName}>
								Escuela de Baloncesto Formativa “El Trapichito”
							</Text>
						</View>
						{/* <Text style={styles.companyWebsite}>
						{invoiceData.company.website}
					</Text> */}
					</View>
					<View style={styles.headerRight}>
						<Text style={styles.invoiceNumber}>
							FACTURA N.° {invoiceData.invoices[0].id}
						</Text>
						<Text style={styles.invoiceDate}>
							{invoiceData.invoices[0].payment_date}
						</Text>
					</View>
				</View>

				{/* Invoice Title */}
				<Text style={styles.invoiceTitle}>FACTURA</Text>

				{/* Client Information */}
				<View style={styles.clientInfo}>
					<Text
						style={styles.clientName}
					>{`${representative_id?.user_id.name} ${representative_id?.user_id.lastname}`}</Text>
					<Text style={styles.clientDetail}>
						Contacto del cliente: {representative_id?.user_id.email}
					</Text>
				</View>

				{/* Table Header */}
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<View style={styles.tableColHeader}>
							<Text>ATLETA(S)</Text>
						</View>
						<View style={styles.tableColQuantity}>
							<Text>MES(ES)</Text>
						</View>
						<View style={styles.tableColPrice}>
							<Text>PRECIO UNITARIO</Text>
						</View>
						<View style={styles.tableColTotal}>
							<Text>TOTAL</Text>
						</View>
						<View style={styles.tableColTotal}>
							<Text>FECHA</Text>
						</View>
					</View>

					{/* Table Content */}
					{invoiceData.invoices.map((item, index) => {
						const athleteID = item.athlete_id;

						const athleteIndex = athletes.findIndex(
							(athlete) => athlete.id === athleteID,
						);

						const athlete = athletes[athleteIndex];

						return (
							<View style={styles.tableRow} key={index.toString()}>
								<View style={styles.tableCell}>
									<Text>{athlete.user_id.lastname}</Text>
									<Text style={{ fontSize: 10, color: "#666" }}>
										{athlete.user_id.name}
									</Text>
								</View>
								<View style={styles.tableCellQuantity}>
									<Text>1</Text>
								</View>
								<View style={styles.tableCellPrice}>
									<Text>{price} Bs</Text>
								</View>
								<View style={styles.tableCellTotal}>
									<Text>{price} Bs</Text>
								</View>

								<View style={styles.tableCellDate}>
									<Text>{item.payment_date}</Text>
								</View>
							</View>
						);
					})}
				</View>

				{/* Total */}
				<View style={styles.totalContainer}>
					<View style={styles.totalRow}>
						<Text style={styles.totalTitle}>TOTAL:</Text>
						<Text style={styles.totalValue}>
							{price * invoiceData.invoices.length} Bs
						</Text>
					</View>
				</View>

				{/* {/* Payment Details
				<View style={styles.paymentDetails}>
					<Text style={styles.paymentTitle}>DETALLES DE PAGO</Text>
					<Text style={styles.paymentInfo}>
						Banco: {invoiceData.payment.bank}
					</Text>
					<Text style={styles.paymentInfo}>
						Propietario: {invoiceData.payment.accountOwner}
					</Text>
					<Text style={styles.paymentInfo}>
						No. de cuenta: {invoiceData.payment.accountNumber}
					</Text>
					<Text style={styles.paymentInfo}>
						Plazo: {invoiceData.payment.dueDate}
					</Text>
					<Text style={styles.paymentInfo}>
						Email: {invoiceData.payment.email}
					</Text>
					<Text style={styles.paymentInfo}>
						Dirección: {invoiceData.payment.address}
					</Text>
					<Text style={styles.paymentInfo}>
						C.P.: {invoiceData.payment.zipCode}
					</Text>
				</View> */}
			</Page>
		</Document>
	);
};
