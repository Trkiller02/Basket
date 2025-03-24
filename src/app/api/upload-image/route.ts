import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const POST = async (req: Request) => {
	try {
		const { file, name, type } = await req.json();

		if (!file) {
			return NextResponse.json({
				message: "No se ha seleccionado ningún archivo.",
			});
		}

		const base64Data = file.replace(/^data:image\/\w+;base64,/, "");

		const filePath = path.join(
			process.cwd(),
			"public",
			"images",
			type,
			`${name}.webp`,
		);

		// Decodificar la cadena Base64 en un buffer
		const buffer = await Buffer.from(base64Data, "base64");

		const imageBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

		await fs.writeFile(filePath, imageBuffer, {
			flag: "w",
			flush: true,
		});

		return NextResponse.json(
			{ message: `/images/${type}/${name}.webp` },
			{ status: 201 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 400 },
		);
	}
};
