import { BreadcrumbsList } from "@/components/linksnav";
import NavBar from "@/components/navbar";
// import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col px-4 gap-2 w-full h-dvh">
			<NavBar />
			<BreadcrumbsList />
			<main className="">{children}</main>
		</div>
	);
}
