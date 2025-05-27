import { db } from "@/lib/db";
import { configurations, users } from "@drizzle/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

(async () => {
	try {
		const [user] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.id, "NlXdGaXfQRVDRj2RDEtN0FCirAuyden0"));

		if (user) {
			console.log("No es necesario ejecutar este script");
			process.exit(0);
		}

		await db.insert(users).values({
			id: "NlXdGaXfQRVDRj2RDEtN0FCirAuyden0",
			name: "OMAR AUGUSTO",
			email: "fernandez56@gmail.com",
			lastname: "MARQUEZ FERNANDEZ",
			password: await bcrypt.hash("123456", 10),
			ci_number: "V29886348",
			role: "administrador",
			restore_code: await bcrypt.hash("123456", 10),
		});

		await db.insert(configurations).values({
			id: "pricing",
			value: "189",
		});

		db.$client.end();

		console.log("Seeder exitosamente ejecutado 🎉");
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
