export const getPropertiesDBConnection = (connectionString: string) => {
	// Crear un nuevo objeto URL
	const url = new URL(connectionString);

	// Construir el objeto de resultado
	return {
		username: url.username,
		password: url.password,
		host: url.hostname,
		port: +url.port,
		database: url.pathname.substring(1), // Elimina la barra inclinada (/) inicial
	};
};
