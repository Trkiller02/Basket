const invoiceStatus = ["Sin cancelar", "Solvente", "Becado", "En proceso"];

export function getInvoiceStatus(status = 0): string {
	if (status >= invoiceStatus.length || status < 0) return "NO IDENTIFICADO";

	return invoiceStatus[status];
}

export const getInvoiceStatusColor = (
	status = 0,
): "danger" | "success" | "warning" | "default" | "primary" | "secondary" => {
	if (status <= 0 || status > 3) return "danger";
	return status === 1 ? "success" : "warning";
};
