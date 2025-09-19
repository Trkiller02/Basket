const omitKeys = new Set([
	"email",
	"password",
	"repeat_password",
	"image",
	"restore_code",
	"category",
	"position",
	"role",
]);

export const setUpper = <T extends Record<string, unknown>>(obj: T): T => {
	for (const key in obj) {
		if (typeof obj[key] === "string" && !omitKeys.has(key)) {
			(obj[key] as string) = (obj[key] as string).toUpperCase();
		}

		if (typeof obj[key] === "object") {
			for (const index in obj[key]) {
				if (typeof obj[key][index] === "string" && !omitKeys.has(index)) {
					(obj[key][index] as string) = obj[key][index].toUpperCase();
				}
			}
		}
	}

	return obj;
};
