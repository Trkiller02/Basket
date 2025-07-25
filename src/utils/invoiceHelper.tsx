const invoiceStatus = ["Sin cancelar", "Solvente", "Becado", "En proceso"];

export function getInvoiceStatus(status = 0): string {
	if (status >= invoiceStatus.length || status < 0) return "NO IDENTIFICADO";

	return invoiceStatus[status];
}

export const getInvoiceStatusColor = (status = 0, bg = false): string => {
	let color = "";

	if (status <= 0 || status > invoiceStatus.length) color = "red-500";
	else if (status === 1) color = "green-500";
	else color = "yellow-500";

	return bg ? `bg-${color}` : color;
};
