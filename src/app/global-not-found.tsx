// Import global styles and fonts
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "404 - Recurso no encontrado",
	description: "Esta pagina no existe",
};

export default function GlobalNotFound() {
	return (
		<html lang="es" className={inter.className}>
			<body>
				<h1>Recurso no encontrado :(</h1>
				<p>La página que estás buscando no existe.</p>
			</body>
		</html>
	);
}
