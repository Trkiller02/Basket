import DashboardLayout from "../tablero/layout";

// export default DashboardLayout;

export const experimental_ppr = true;

export default function OverviewLayout({
	children,
	table,
	stadistics,
}: {
	children: React.ReactNode;
	table: React.ReactNode;
	stadistics: React.ReactNode;
}) {
	return (
		<DashboardLayout>
			<section className="flex flex-col gap-2 w-full">
				{stadistics}
				{children}
				{table}
			</section>
		</DashboardLayout>
	);
}
