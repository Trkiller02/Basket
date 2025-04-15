export function getInvoiceStatus(status = 0): string {
	switch (status) {
		case 0:
			return "Sin pagar";
		case 1:
			return "Pagado";
		case 2:
			return "Becado";
		default:
			return "NO IDENTIFICADO";
	}
}
