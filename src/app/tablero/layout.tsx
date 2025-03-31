import { BreadcrumbsList } from "@/components/linksnav";
// import Sidebar from "@/components/sidebar";
import { Sidebar } from "@/components/sidebar";

export const experimental_ppr = true;

export default function DashboardLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="flex flex-row h-screen w-full">
			<Sidebar />
			<div className="flex flex-col m-4 gap-2 w-full">
				<BreadcrumbsList />
				<main className="">{children}</main>
			</div>
		</div>
	);
}
