export const setUpper = <T extends Record<string, unknown>>(obj: T): T => {
	for (const key in obj) {
		if (
			typeof obj[key] === "string" &&
			key !== "email" &&
			key !== "password" &&
			key !== "repeat_password"
		) {
			(obj[key] as string) = (obj[key] as string).toUpperCase();
		}

		if (typeof obj[key] === "object") {
			for (const index in obj[key]) {
				if (
					typeof obj[key][index] === "string" &&
					index !== "email" &&
					index !== "image"
				) {
					(obj[key][index] as string) = obj[key][index].toUpperCase();
				}
			}
		}
	}

	return obj;
};
