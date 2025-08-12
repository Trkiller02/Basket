import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";
import { Toaster as ToastProvider } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export default async function GlobalLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = auth();

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 14)",
				} as React.CSSProperties
			}
		>
			<SessionProvider session={await session}>
				<AppSidebar variant="inset" collapsible="icon" session={session} />
				<SidebarInset>
					<SiteHeader />
					<div className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6 ">
						<TooltipProvider>{children}</TooltipProvider>
						<ToastProvider />
					</div>
				</SidebarInset>
			</SessionProvider>
		</SidebarProvider>
	);
}
