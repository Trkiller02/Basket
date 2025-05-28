import GlobalLayout from "@/components/layout/global-layout";

export default function OverviewLayout({
	children,
	stats,
	datatable,
}: {
	children: React.ReactNode;
	stats: React.ReactNode;
	datatable: React.ReactNode;
}) {
	return (
		<GlobalLayout>
			{children}
			{stats}
			{datatable}
		</GlobalLayout>
	);
}
