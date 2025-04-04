import { authClient } from "@/lib/auth-client";
import DashboardLayout from "../tablero/layout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// export default DashboardLayout;

export const experimental_ppr = true;

export default async function OverviewLayout({
	children,
	table,
	stadistics,
}: {
	children: React.ReactNode;
	table: React.ReactNode;
	stadistics: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<DashboardLayout>
			<section className="flex flex-col gap-2 w-full">
				{session?.user?.role === "admin" && stadistics}
				{children}
				{session?.user?.role === "admin" && table}
			</section>
		</DashboardLayout>
	);
}
