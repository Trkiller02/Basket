import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { insertHistory } from "@/lib/db-data";
import path from "node:path";
import fsPromise from "node:fs/promises";
import { pgRestore } from "pg-dump-restore";
import { getPropertiesDBConnection } from "@/utils/restore_helper";

export const runtime = "nodejs";

export const POST = auth(async (request) => {
	try {
		if (!request.auth)
			return NextResponse.json({ message: "No autenticado" }, { status: 401 });

		if (request.auth.user.role !== "administrador")
			return NextResponse.json({ message: "No autorizado" }, { status: 401 });

		const formData = await request.formData();
		const file = formData.get("sqlFile") as File;

		if (!file) {
			return NextResponse.json(
				{ error: "No se proporcionó ningún archivo" },
				{ status: 400 },
			);
		}

		if (!file.name.endsWith(".sql")) {
			return NextResponse.json(
				{ error: "El archivo debe tener extensión .sql" },
				{ status: 400 },
			);
		}

		if (!file.name.match(/^backup_\d{4}-\d{2}-\d{2}\.sql$/g))
			return NextResponse.json(
				{ error: "El archivo no proviene de este sistema." },
				{ status: 400 },
			);

		if (!(await file.text()).trim()) {
			return NextResponse.json(
				{ error: "El archivo SQL está vacío" },
				{ status: 400 },
			);
		}

		const files = await fsPromise.readdir(process.cwd(), {
			recursive: false,
		});

		const fileDirname = files.find(
			(file) => file.endsWith(".sql") && file.startsWith("backup"),
		);

		const dateNow = new Date().toISOString().split("T")[0];

		if (
			fileDirname &&
			fileDirname.slice(7, fileDirname.indexOf(".")) >
				file.name.slice(7, file.name.indexOf("."))
		)
			return NextResponse.json(
				{ error: "El archivo proporcionado es más antiguo que el actual." },
				{ status: 400 },
			);

		if (file.name.slice(7, file.name.indexOf(".")) > dateNow)
			return NextResponse.json(
				{ error: "El archivo proporcionado parece estar manipulado." },
				{ status: 400 },
			);

		const pathname = path.join(process.cwd(), file.name);

		// Guardar el archivo en el directorio de trabajo
		await fsPromise.writeFile(pathname, Buffer.from(await file.arrayBuffer()));

		const DB_PROPERTIES = getPropertiesDBConnection(
			process.env.DATABASE_URL ?? "",
		);

		const { stderr } = await pgRestore(DB_PROPERTIES, {
			filePath: pathname,
		});

		if (stderr) return NextResponse.json({ message: stderr }, { status: 400 });

		await insertHistory({
			user_id: request.auth.user.id ?? "",
			description: `Base de datos restaurada el ${new Date().toISOString()}`,
			action: "MODIFICO",
		});

		return NextResponse.json({
			message: "Restauración completada correctamente.",
		});
	} catch (error: unknown) {
		console.error("Error durante el restore:", error);
		return NextResponse.json(
			{
				error: "Error durante el proceso de restore",
				details: (error as Error).message,
			},
			{ status: 500 },
		);
	}
});
