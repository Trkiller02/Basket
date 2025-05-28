import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavBreadcrumbs } from "./nav-links";
import UserDropdown from "../user-dropdown";
import { auth } from "@/auth";

export async function SiteHeader() {
	const session = auth();

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<NavBreadcrumbs />

				<div className="flex ml-auto">
					<UserDropdown session={session} />
				</div>
			</div>
		</header>
	);
}
