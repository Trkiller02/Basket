import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const POST = async (req: Request) => {
	try {
		const { file, name, type } = await req.json();

		if (!file) {
			return NextResponse.json({
				message: "No se ha seleccionado ningún archivo.",
			});
		}

		const base64Data = file.replace(/^data:image\/\w+;base64,/, "");

		// Decodificar la cadena Base64 en un buffer
		const buffer = await Buffer.from(base64Data, "base64");

		const filePath = path.join(process.cwd(), "public", type, `${name}.jpg`);

		await fs.appendFile(filePath, buffer);

		return NextResponse.json({ message: `/${type}/${name}` }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	}
};
