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
		key: "mother",
		value: "MADRE",
	},
	{
		key: "representative",
		value: "REPRESENTANTE LEGAL",
	},
	{
		key: "father",
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

export const REPRESENT_LIST = ["representative", "mother", "father"];

export const formEntities = new Set<string>([
	"atleta",
	"salud",
	"representante",
	"madre",
	"padre",
	"resumen",
]);
