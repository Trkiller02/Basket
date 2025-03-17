const primaryColumns = [
	{ name: "C.I", uid: "ci_number" },
	{ name: "Nombre", uid: "name" },
	{ name: "Contacto", uid: "email" },
];

const userColumns = [...primaryColumns, { name: "Rol", uid: "role_id" }];

const athleteColumns = [
	...primaryColumns,
	{ name: "Categoria", uid: "category" },
	{ name: "Posición", uid: "position" },
	{ name: "Estado solvente", uid: "solvent" },
];

const endColumns = { name: "Acciones", uid: "actions" };

export { athleteColumns, userColumns, primaryColumns, endColumns };
