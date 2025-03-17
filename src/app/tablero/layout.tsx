import { BreadcrumbsList } from "@/components/linksnav";
// import Sidebar from "@/components/sidebar";
import { Sidebar } from "@/components/sidebar";

export const experimental_ppr = true;

export default function DashboardLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="flex flex-row gap-2 h-[98vh]">
			<Sidebar />
			<div className="flex flex-col mt-4 gap-2 w-full">
				<BreadcrumbsList />
				<main className="flex justify-center items-center">{children}</main>
			</div>
		</div>
	);
}
