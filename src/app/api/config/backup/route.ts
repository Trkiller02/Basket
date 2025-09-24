import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pgDump } from "pg-dump-restore";
import { getPropertiesDBConnection } from "@/utils/restore_helper";
import { cwd } from "node:process";
import path from "node:path";
import fsPromise from "node:fs/promises";
import { insertHistory } from "@/lib/db-data";

export const runtime = "nodejs";

export const POST = auth(async (request) => {
	if (!request.auth)
		return NextResponse.json({ message: "No autenticado" }, { status: 401 });

	if (request.auth.user.role !== "administrador")
		return NextResponse.json({ message: "No autorizado" }, { status: 401 });

	const DB_PROPERTIES = getPropertiesDBConnection(
		process.env.DATABASE_URL ?? "",
	);

	const filename = `backup_${new Date().toISOString().split("T")[0]}.sql`;
	const pathname = path.join(cwd(), filename);

	try {
		const { stderr } = await pgDump(DB_PROPERTIES, {
			filePath: pathname,
			clean: true,
			ifExists: true,
			onConflictDoNothing: true,
			inserts: true,
		});

		if (stderr) return NextResponse.json({ message: stderr }, { status: 400 });

		const fileContent = await fsPromise.readFile(pathname);

		// Configurar headers para descarga
		const headers = new Headers({
			"Content-Type": "application/sql",
			"Content-Disposition": `attachment; filename="${filename}"`,
			"Content-Length": fileContent.length.toString(),
		});

		// Insertar en el historial
		await insertHistory({
			user_id: request.auth?.user?.id ?? "",
			description: `Backup realizado el ${new Date().toISOString()}`,
			action: "CREO",
		});

		return new NextResponse(fileContent as unknown as ReadableStream, {
			headers,
		});
	} catch (error) {
		console.error("Error al crear backup SQL:", error);
		return NextResponse.json(
			{
				message: `Error al crear el backup SQL de la base de datos: ${(error as Error).message}`,
			},
			{ status: 500 },
		);
	}
});
