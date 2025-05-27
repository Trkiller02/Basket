import { NextResponse } from "next/server";
import { auth as middleware } from "@/auth";

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
	}

	/* if (!!session && request.nextUrl.pathname.startsWith("/sesion"))
		return NextResponse.redirect(new URL("/", request.url)); */

	return NextResponse.next();
});

export const config = {
	runtime: "nodejs",
	matcher: ["/", "/sesion/:path*", "/configuracion", "/perfil"], // Apply middleware to specific routes
};
