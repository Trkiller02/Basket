import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function GlobalLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 14)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" collapsible="icon" />
			<SidebarInset>
				<SiteHeader />
				<main className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6 ">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
