enum Messages {
	MATCH_ERR = "Esta suministrando caracteres no soportados",
	EMAIL_ERR = "El correo que suministro no es valido",
	REQUIRED = "Este campo es requerido",
	AUTH_ERR = "C.I ó Correo electronico",
	DNI_MATCH = "V8938... (V) Venezolano (E) Extranjero)",
	MIN_PASS = "Se requiere una contraseña mayor a 4 dígitos",
	MIN_ERR = "Esta ingresando valores menores a los esperados",
	MAX_ERR = "Esta ingresando valores mayores a los esperados",
	PHONE_FORMAT = "Es necesario ingresar un número telefónico venezolano.",
}

enum MsgError {
	NOT_FOUND = "No se encontro el registro",
	NOT_FOUND_MANY = "No se encontraron registros",
	CONFLICT = "El registro ya existe",
	BAD_REQUEST = "La solicitud no es válida",
	UNAUTHORIZED = "No estás autorizado para realizar esta acción",
	INTERNAL_SERVER = "Ha ocurrido un error interno",
}

export { Messages, MsgError };
