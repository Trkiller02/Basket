export const entitySelect = [
	{
		label: "Estudiantes",
		value: "estudiante",
		description: "Buscar Estudiantes inscritos en la institución.",
	},
	{
		label: "Representantes",
		value: "representante",
		description: "Buscar Representantes vinculados a estudiantes.",
	},
	{
		label: "Usuarios",
		value: "usuario",
		description: "Buscar Usuarios dentro del sistema.",
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

export const roleSelect = [
	{
		label: "EVALUACIÓN",
		value: 2,
		description: "Perteneciente al Depto. de Evaluación.",
	},
	{
		label: "DOCENTE",
		value: 3,
		description: "Perteneciente a los Docentes habilitados para inscribir.",
	},
	{
		label: "ADMINISTRACIÓN",
		value: 4,
		description: "Perteneciente al Depto. de Administración.",
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

export const formEntities = [
	"estudiante",
	"representante",
	"padre",
	"madre",
	"salud",
];
