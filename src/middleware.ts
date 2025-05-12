import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (request.nextUrl.pathname.startsWith("/sesion") && !session) {
		return NextResponse.next();
	}

	if (!session) {
		return NextResponse.redirect(new URL("/sesion/iniciar", request.url));
	}

	if (request.nextUrl.pathname.startsWith("/sesion") && session) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	/* if (!!session && request.nextUrl.pathname.startsWith("/sesion"))
		return NextResponse.redirect(new URL("/", request.url)); */

	return NextResponse.next();
}

export const config = {
	runtime: "nodejs",
	matcher: ["/", "/sesion/:path*", "/configuracion", "/perfil"], // Apply middleware to specific routes
};
