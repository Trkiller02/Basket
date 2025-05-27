import { auth } from "@/auth";
import DashboardLayout from "../tablero/layout";

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
	const session = await auth();

	return (
		<DashboardLayout>
			<section className="flex flex-col gap-2 w-full">
				{session?.user?.role === "administrador" && stadistics}
				{children}
				{session?.user?.role === "administrador" && table}
			</section>
		</DashboardLayout>
	);
}
