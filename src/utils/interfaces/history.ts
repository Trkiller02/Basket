// Tipo para los logs del sistema basado en el formato proporcionado
export type SystemLog = {
	id: number;
	user_id: string;
	description: string | null;
	action:
		| "MODIFICO"
		| "CREO"
		| "ELIMINO"
		| "PAGO"
		| "INICIO SESION"
		| "CERRO SESION";
	reference_id: string | null;
	created_at: string | null;
};
