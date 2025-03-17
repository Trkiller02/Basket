export const entitySelect = [
	{
		label: "Atletas",
		value: "atleta",
		description: "Buscar atletas inscritos en el sistema.",
	},
	{
		label: "Representantes",
		value: "representante",
		description: "Buscar Representantes vinculados a atletas.",
	},
	{
		label: "Usuarios",
		value: "usuario",
		description: "Buscar usuarios dentro del sistema.",
	},
];

export const relationSelect = [
	{
		key: "madre",
		value: "MADRE",
	},
	{
		key: "representante",
		value: "REPRESENTANTE LEGAL",
	},
	{
		key: "padre",
		value: "PADRE",
	},
];

export const sexSelect = [
	{
		value: "MASCULINO",
	},
	{
		value: "FEMENINO",
	},
];

export const bloodList = [
	{ key: "A+" },
	{ key: "A-" },
	{ key: "B+" },
	{ key: "B-" },
	{ key: "AB+" },
	{ key: "AB-" },
	{ key: "O+" },
	{ key: "O-" },
];

export const formEntities = new Set<string>([
	"atleta",
	"salud",
	"representante",
	"madre",
	"padre",
	"resumen",
]);
