import { NextResponse } from "next/server";
import { auth as middleware } from "./auth";

export default middleware((request) => {
	const session = request.auth;

	if (!session) {
		if (
			request.nextUrl.pathname.endsWith("/iniciar") ||
			request.nextUrl.pathname.endsWith("/recuperar")
		)
			return NextResponse.next();

		return NextResponse.redirect(new URL("/sesion/iniciar", request.url));
	}

	if (session) {
		if (request.nextUrl.pathname.startsWith("/sesion")) {
			if (request.nextUrl.pathname.endsWith("/completar"))
				return NextResponse.next();

			return NextResponse.redirect(new URL("/", request.url));
		}

		if (request.auth?.user.role === "representante") {
			if (request.nextUrl.pathname.endsWith("/registrar"))
				return NextResponse.redirect(new URL("/", request.url));

			if (request.nextUrl.pathname.endsWith("/editar"))
				return NextResponse.redirect(new URL("/", request.url));

			if (request.nextUrl.pathname.startsWith("/configuracion")) {
				if (request.nextUrl.pathname.endsWith("/perfil"))
					return NextResponse.next();

				return NextResponse.redirect(new URL("/", request.url));
			}
		}
	}

	/* if (!!session && request.nextUrl.pathname.startsWith("/sesion"))
		return NextResponse.redirect(new URL("/", request.url)); */

	return NextResponse.next();
});

export const config = {
	runtime: "nodejs",
	matcher: ["/", "/sesion/:path*", "/configuracion", "/perfil"],
};
