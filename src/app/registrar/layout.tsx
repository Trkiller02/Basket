import DashboardLayout from "@/app/tablero/layout";

export default async function RegisterLayout({
	progress,
	children,
}: { progress: React.ReactNode; children: React.ReactNode }) {
	return (
		<DashboardLayout>
			<section className="grid grid-cols-[75%_1fr] gap-2 w-full place-items-center mb-4">
				{children}
				{progress}
			</section>
		</DashboardLayout>
	);
}
