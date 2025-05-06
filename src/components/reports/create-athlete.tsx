import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
} from "@react-pdf/renderer";

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
	},
	logo: {
		width: 100,
		height: 50,
	},
	schoolName: {
		fontSize: 10,
		fontWeight: "bold",
		width: 200,
		textAlign: "center",
	},
	photoContainer: {
		width: 70,
		height: 90,
		border: "1pt solid black",
		alignItems: "center",
		justifyContent: "center",
	},
	photoText: {
		fontSize: 10,
	},
	title: {
		fontSize: 12,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 5,
		marginTop: 5,
	},
	sectionTitle: {
		fontSize: 10,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 15,
		marginBottom: 5,
	},
	table: {
		display: "flex",
		width: "auto",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#000",
		marginBottom: 10,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#000",
	},
	tableRowNoBorder: {
		flexDirection: "row",
	},
	tableCol: {
		borderRightWidth: 1,
		borderRightColor: "#000",
		padding: 5,
	},
	tableColNoBorder: {
		padding: 5,
	},
	tableCell: {
		fontSize: 8,
		textAlign: "center",
	},
	tableCellHeader: {
		fontSize: 8,
		fontWeight: "bold",
		textAlign: "center",
	},
	growthTable: {
		marginTop: 10,
		marginBottom: 10,
	},
	growthRow: {
		flexDirection: "row",
		marginBottom: 5,
	},
	growthLabel: {
		fontSize: 8,
		width: 40,
	},
	growthField: {
		fontSize: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		width: 100,
		marginRight: 10,
	},
	parentInfo: {
		marginTop: 10,
	},
	parentRow: {
		flexDirection: "row",
		marginBottom: 5,
	},
	parentLabel: {
		fontSize: 8,
		width: 80,
	},
	parentField: {
		fontSize: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		flex: 1,
		marginRight: 5,
	},
	footer: {
		position: "absolute",
		bottom: 30,
		left: 30,
		right: 30,
		fontSize: 6,
		textAlign: "center",
	},
	checkboxRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	checkboxCol: {
		width: "33%",
		textAlign: "center",
		padding: 2,
		fontSize: 8,
	},
	checkbox: {
		width: 10,
		height: 10,
		border: "1pt solid black",
		marginHorizontal: 5,
	},
});

// Create Document Component
const RegistrationForm = () => (
	<Document>
		<Page size="A4" style={styles.page}>
			{/* Header */}
			<View style={styles.header}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Image
						style={styles.logo}
						src="/placeholder.svg?height=50&width=100"
					/>
					<View style={styles.schoolName}>
						<Text>ESCUELA DE BALONCESTO FORMATIVO EL TRAPICHITO</Text>
						<Text style={{ fontSize: 9, marginTop: 5 }}>
							FICHA DE INSCRIPCIÓN
						</Text>
					</View>
				</View>
				<View style={styles.photoContainer}>
					<Text style={styles.photoText}>FOT</Text>
				</View>
			</View>

			{/* Personal Data */}
			<Text style={styles.sectionTitle}>DATOS PERSONALES</Text>
			<View style={styles.table}>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCellHeader}>NOMBRES</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCellHeader}>APELLIDOS</Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCellHeader}>FECHA DE NACIMIENTO</Text>
					</View>
				</View>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCell}></Text>
					</View>
				</View>
			</View>

			<View style={styles.table}>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCellHeader}>DOCUMENTO DE IDENTIDAD</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCellHeader}>EDAD</Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCellHeader}>LUGAR DE NACIMIENTO</Text>
					</View>
				</View>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCell}></Text>
					</View>
				</View>
			</View>

			<View style={styles.table}>
				<View style={styles.tableRow}>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCellHeader}>DOMICILIO</Text>
					</View>
				</View>
				<View style={styles.tableRow}>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCell}></Text>
					</View>
				</View>
			</View>

			<View style={styles.table}>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCellHeader}>
							AUTORIZACIÓN MÉDICA PARA REALIZAR EJERCICIO FÍSICO
						</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCellHeader}>SI</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCellHeader}>NO</Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCellHeader}>GRUPO SANGUÍNEO</Text>
					</View>
				</View>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCell}></Text>
					</View>
				</View>
			</View>

			{/* Important Information */}
			<Text style={styles.sectionTitle}>INFORMACIÓN IMPORTANTE</Text>
			<View style={styles.table}>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCellHeader}></Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCellHeader}>SI</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCellHeader}>NO</Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCellHeader}>CUAL</Text>
					</View>
				</View>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}>SUFRE DE ALERGIAS</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCell}></Text>
					</View>
				</View>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}>TOMA MEDICAMENTOS</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCell}></Text>
					</View>
				</View>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}>INTERVENCIÓN QUIRÚRGICA</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCell}></Text>
					</View>
				</View>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}>LESIONES DE ALGÚN TIPO</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCell}></Text>
					</View>
				</View>
				<View style={styles.tableRow}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}>SUFRE DE ASMA</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}></Text>
					</View>
					<View style={styles.tableColNoBorder}>
						<Text style={styles.tableCell}></Text>
					</View>
				</View>
			</View>

			{/* Growth Monitoring */}
			<Text style={styles.sectionTitle}>RELEVAMIENTO DEL CRECIMIENTO</Text>
			<View style={styles.growthTable}>
				<View style={styles.growthRow}>
					<Text style={styles.growthLabel}>Fecha 1</Text>
					<Text style={styles.growthField}></Text>
					<Text style={styles.growthLabel}>Peso</Text>
					<Text style={styles.growthField}></Text>
					<Text style={styles.growthLabel}>Altura</Text>
					<Text style={styles.growthField}></Text>
				</View>
				<View style={styles.growthRow}>
					<Text style={styles.growthLabel}>Fecha 1</Text>
					<Text style={styles.growthField}></Text>
					<Text style={styles.growthLabel}>Peso</Text>
					<Text style={styles.growthField}></Text>
					<Text style={styles.growthLabel}>Altura</Text>
					<Text style={styles.growthField}></Text>
				</View>
				<View style={styles.growthRow}>
					<Text style={styles.growthLabel}>Fecha 1</Text>
					<Text style={styles.growthField}></Text>
					<Text style={styles.growthLabel}>Peso</Text>
					<Text style={styles.growthField}></Text>
					<Text style={styles.growthLabel}>Altura</Text>
					<Text style={styles.growthField}></Text>
				</View>
			</View>

			{/* Parent Information */}
			<Text style={styles.sectionTitle}>DATOS DE LOS PADRES</Text>
			<View style={styles.parentInfo}>
				<View style={styles.parentRow}>
					<Text style={styles.parentLabel}>Nombre del padre:</Text>
					<Text style={styles.parentField}></Text>
					<Text style={styles.parentLabel}>Altura:</Text>
					<Text style={styles.parentField}></Text>
					<Text style={styles.parentLabel}>Celular:</Text>
					<Text style={styles.parentField}></Text>
				</View>
				<View style={styles.parentRow}>
					<Text style={styles.parentLabel}>Ocupación:</Text>
					<Text style={styles.parentField}></Text>
				</View>
				<View style={styles.parentRow}>
					<Text style={styles.parentLabel}>Nombre de la madre:</Text>
					<Text style={styles.parentField}></Text>
					<Text style={styles.parentLabel}>Altura:</Text>
					<Text style={styles.parentField}></Text>
					<Text style={styles.parentLabel}>Celular:</Text>
					<Text style={styles.parentField}></Text>
				</View>
				<View style={styles.parentRow}>
					<Text style={styles.parentLabel}>Ocupación:</Text>
					<Text style={styles.parentField}></Text>
				</View>
			</View>

			{/* Footer */}
			<View style={styles.footer}>
				<Text>
					Calle principal M. Mercedario Dique Los Sauces, Cerrillos Provincia,
					punto abajo del aeródromo Ejido. Mérida
				</Text>
			</View>
		</Page>
	</Document>
);

export default RegistrationForm;
