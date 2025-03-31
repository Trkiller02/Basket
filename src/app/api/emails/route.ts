import EmailTemplate from "@/components/email-template";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
	const { username, url } = await req.json();

	try {
		const { data, error } = await resend.emails.send({
			from: "Acme <trollkiller0207@gmail.com>",
			to: ["omarmarquez0207@gmail.com"],
			subject: "Hello world",
			react: EmailTemplate({ username, url }),
		});

		if (error) {
			return NextResponse.json({ error }, { status: 500 });
		}

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
