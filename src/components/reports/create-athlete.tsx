import type { RegisterData } from "@/store/useRegisterStore";
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
		alignItems: "center",
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		width: "80%",
	},
	logo: {
		width: 80,
		height: 40,
		marginRight: 10,
	},
	schoolInfo: {
		textAlign: "center",
	},
	schoolName: {
		fontSize: 10,
		fontWeight: "bold",
	},
	formTitle: {
		fontSize: 9,
		marginTop: 3,
	},
	photoContainer: {
		width: 70,
		height: 80,
		border: "1pt solid black",
		alignItems: "center",
		justifyContent: "center",
	},
	photoText: {
		fontSize: 10,
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
		width: "100%",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#000",
		marginBottom: 5,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#000",
	},
	tableLastRow: {
		flexDirection: "row",
	},
	tableCol: {
		borderRightWidth: 1,
		borderRightColor: "#000",
	},
	tableLastCol: {},
	tableCell: {
		fontSize: 8,
		textAlign: "center",
		padding: 3,
		minHeight: 20,
		justifyContent: "center",
	},
	tableCellHeader: {
		fontSize: 8,
		fontWeight: "bold",
		textAlign: "center",
		padding: 3,
	},
	growthSection: {
		marginTop: 10,
		marginBottom: 10,
	},
	growthRow: {
		flexDirection: "row",
		marginBottom: 5,
	},
	growthItem: {
		flexDirection: "row",
		marginRight: 15,
	},
	growthLabel: {
		fontSize: 8,
		marginRight: 5,
	},
	growthField: {
		fontSize: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		width: 50,
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
		marginRight: 5,
	},
	parentField: {
		fontSize: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		flex: 1,
		marginRight: 10,
	},
	footer: {
		position: "absolute",
		bottom: 30,
		left: 30,
		right: 30,
		fontSize: 6,
		textAlign: "center",
	},
});

// Create Document Component
const RegistrationForm = ({ data }: { data: RegisterData }) => {
	const { athlete, health, representative, mother, father } = data;

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<Image
							src={`${process.cwd()}/public/trapiche.png`}
							style={styles.logo}
						/>
						<View style={styles.schoolInfo}>
							<Text style={styles.schoolName}>
								ESCUELA DE BALONCESTO FORMATIVO EL TRAPICHITO
							</Text>
							<Text style={styles.formTitle}>FICHA DE INSCRIPCIÓN</Text>
						</View>
					</View>
					<View style={styles.photoContainer}>
						<Text style={styles.photoText}>FOT</Text>
					</View>
				</View>

				{/* Personal Data */}
				<Text style={styles.sectionTitle}>DATOS PERSONALES</Text>

				{/* Names, Surnames, Birth Date */}
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<View style={[styles.tableCol, { width: "33.3%" }]}>
							<Text style={styles.tableCellHeader}>NOMBRES</Text>
						</View>
						<View style={[styles.tableCol, { width: "33.3%" }]}>
							<Text style={styles.tableCellHeader}>APELLIDOS</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "33.4%" }]}>
							<Text style={styles.tableCellHeader}>FECHA DE NACIMIENTO</Text>
						</View>
					</View>
					<View style={styles.tableLastRow}>
						<View style={[styles.tableCol, { width: "33.3%" }]}>
							<Text style={styles.tableCell}>{athlete?.user_id.name}</Text>
						</View>
						<View style={[styles.tableCol, { width: "33.3%" }]}>
							<Text style={styles.tableCell}>{athlete?.user_id.lastname}</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "33.4%" }]}>
							<Text style={styles.tableCell}>{athlete?.birth_date}</Text>
						</View>
					</View>
				</View>

				{/* ID, Age, Birth Place */}
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<View style={[styles.tableCol, { width: "40%" }]}>
							<Text style={styles.tableCellHeader}>DOCUMENTO DE IDENTIDAD</Text>
						</View>
						<View style={[styles.tableCol, { width: "20%" }]}>
							<Text style={styles.tableCellHeader}>EDAD</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "40%" }]}>
							<Text style={styles.tableCellHeader}>LUGAR DE NACIMIENTO</Text>
						</View>
					</View>
					<View style={styles.tableLastRow}>
						<View style={[styles.tableCol, { width: "40%" }]}>
							<Text style={styles.tableCell}>{athlete?.user_id.ci_number}</Text>
						</View>
						<View style={[styles.tableCol, { width: "20%" }]}>
							<Text style={styles.tableCell}>{athlete?.age}</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "40%" }]}>
							<Text style={styles.tableCell}>{athlete?.birth_place}</Text>
						</View>
					</View>
				</View>

				{/* Address */}
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<View style={[styles.tableLastCol, { width: "100%" }]}>
							<Text style={styles.tableCellHeader}>DOMICILIO</Text>
						</View>
					</View>
					<View style={styles.tableLastRow}>
						<View style={[styles.tableLastCol, { width: "100%" }]}>
							<Text style={styles.tableCell}>{athlete?.address}</Text>
						</View>
					</View>
				</View>

				{/* Medical Authorization */}
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<View style={[styles.tableCol, { width: "40%" }]}>
							<Text style={styles.tableCellHeader}>
								AUTORIZACIÓN MÉDICA PARA REALIZAR EJERCICIO FÍSICO
							</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>SI</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{health?.medical_authorization ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>NO</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{!health?.medical_authorization ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "30%" }]}>
							<Text style={styles.tableCellHeader}>GRUPO SANGUÍNEO</Text>
						</View>
						<View style={[styles.tableCol, { width: "10%" }]}>
							<Text style={styles.tableCellHeader}>{health?.blood_type}</Text>
						</View>
					</View>
				</View>

				{/* Important Information */}
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<View style={[styles.tableCol, { width: "100%" }]}>
							<Text style={styles.sectionTitle}>INFORMACIÓN IMPORTANTE</Text>
						</View>

						<View style={[styles.tableLastCol, { width: "30%" }]}>
							<Text style={styles.tableCellHeader}>CUAL</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={[styles.tableCol, { width: "30%" }]}>
							<Text style={styles.tableCell}>SUFRE DE ALERGIAS</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>SI</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{health?.has_allergies ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>NO</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{!health?.has_allergies ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "20%" }]}>
							<Text style={styles.tableCellHeader}>CUAL</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "30%" }]}>
							<Text style={styles.tableCell}>{health?.has_allergies}</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={[styles.tableCol, { width: "30%" }]}>
							<Text style={styles.tableCell}>TOMA MEDICAMENTOS</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>SI</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{health?.takes_medications ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>NO</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{!health?.takes_medications ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "20%" }]}>
							<Text style={styles.tableCellHeader}>CUAL</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "30%" }]}>
							<Text style={styles.tableCell}>{health?.takes_medications}</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={[styles.tableCol, { width: "30%" }]}>
							<Text style={styles.tableCell}>INTERVENCIÓN QUIRÚRGICA</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>SI</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{health?.surgical_intervention ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>NO</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{!health?.surgical_intervention ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "20%" }]}>
							<Text style={styles.tableCellHeader}>CUAL</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "30%" }]}>
							<Text style={styles.tableCell}>
								{health?.surgical_intervention}
							</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={[styles.tableCol, { width: "50%" }]}>
							<Text style={styles.tableCell}>LESIONES DE ALGÚN TIPO</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>SI</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{health?.injuries ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>NO</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{!health?.injuries ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "20%" }]}>
							<Text style={styles.tableCellHeader}>CUAL</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "30%" }]}>
							<Text style={styles.tableCell}>{health?.injuries}</Text>
						</View>
					</View>
					<View style={styles.tableLastRow}>
						<View style={[styles.tableCol, { width: "50%" }]}>
							<Text style={styles.tableCell}>SUFRE DE ASMA</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>SI</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{health?.has_asthma ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>NO</Text>
						</View>
						<View style={[styles.tableCol, { width: "5%" }]}>
							<Text style={styles.tableCellHeader}>
								{!health?.has_asthma ? "X" : ""}
							</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "20%" }]}>
							<Text style={styles.tableCellHeader}>{""}</Text>
						</View>
						<View style={[styles.tableLastCol, { width: "30%" }]}>
							<Text style={styles.tableCell}>{""}</Text>
						</View>
					</View>
				</View>

				{/* Growth Monitoring */}
				<Text style={styles.sectionTitle}>RELEVAMIENTO DEL CRECIMIENTO</Text>
				<View style={styles.growthSection}>
					<View style={styles.growthRow}>
						<View style={styles.growthItem}>
							<Text style={styles.growthLabel}>Fecha 1</Text>
							<Text style={styles.growthField}>{""}</Text>
						</View>
						<View style={styles.growthItem}>
							<Text style={styles.growthLabel}>Peso</Text>
							<Text style={styles.growthField}>{""}</Text>
						</View>
						<View style={styles.growthItem}>
							<Text style={styles.growthLabel}>Altura</Text>
							<Text style={styles.growthField}>{""}</Text>
						</View>
					</View>
					<View style={styles.growthRow}>
						<View style={styles.growthItem}>
							<Text style={styles.growthLabel}>Fecha 1</Text>
							<Text style={styles.growthField}>{""}</Text>
						</View>
						<View style={styles.growthItem}>
							<Text style={styles.growthLabel}>Peso</Text>
							<Text style={styles.growthField}>{""}</Text>
						</View>
						<View style={styles.growthItem}>
							<Text style={styles.growthLabel}>Altura</Text>
							<Text style={styles.growthField}>{""}</Text>
						</View>
					</View>
					<View style={styles.growthRow}>
						<View style={styles.growthItem}>
							<Text style={styles.growthLabel}>Fecha 1</Text>
							<Text style={styles.growthField}>{""}</Text>
						</View>
						<View style={styles.growthItem}>
							<Text style={styles.growthLabel}>Peso</Text>
							<Text style={styles.growthField}>{""}</Text>
						</View>
						<View style={styles.growthItem}>
							<Text style={styles.growthLabel}>Altura</Text>
							<Text style={styles.growthField}>{""}</Text>
						</View>
					</View>
				</View>

				{/* Parent Information */}
				<Text style={styles.sectionTitle}>DATOS DE LOS PADRES</Text>
				<View style={styles.parentInfo}>
					<View style={styles.parentRow}>
						<Text style={styles.parentLabel}>Nombre del padre:</Text>
						<Text style={styles.parentField}>
							{typeof father === "object"
								? `${father.user_id.name} ${father.user_id.lastname}`
								: ""}
						</Text>
						<Text style={styles.parentLabel}>Altura:</Text>
						<Text style={styles.parentField}>
							{typeof father === "object" ? father.height?.toString() : ""}
						</Text>
						<Text style={styles.parentLabel}>Celular:</Text>
						<Text style={styles.parentField}>
							{typeof father === "object" ? father.user_id.phone_number : ""}
						</Text>
					</View>
					<View style={styles.parentRow}>
						<Text style={styles.parentLabel}>Ocupación:</Text>
						<Text style={styles.parentField}>
							{typeof father === "object" ? father.occupation : ""}
						</Text>
					</View>
					<View style={styles.parentRow}>
						<Text style={styles.parentLabel}>Nombre de la madre:</Text>
						<Text style={styles.parentField}>
							{" "}
							{typeof mother === "object"
								? `${mother.user_id.name} ${mother.user_id.lastname}`
								: ""}
						</Text>
						<Text style={styles.parentLabel}>Altura:</Text>
						<Text style={styles.parentField}>
							{typeof mother === "object" ? mother.height?.toString() : ""}
						</Text>
						<Text style={styles.parentLabel}>Celular:</Text>
						<Text style={styles.parentField}>
							{" "}
							{typeof mother === "object" ? mother.user_id.phone_number : ""}
						</Text>
					</View>
					<View style={styles.parentRow}>
						<Text style={styles.parentLabel}>Ocupación:</Text>
						<Text style={styles.parentField}>
							{typeof mother === "object" ? mother.occupation : ""}
						</Text>
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
};

export default RegistrationForm;
