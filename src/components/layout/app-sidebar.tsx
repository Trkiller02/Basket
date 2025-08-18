"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Logo from "@/assets/trapiche.svg";
import {
	LayoutDashboard,
	Settings2,
	UserPlus2,
	UserRoundCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { UserDropdown } from "../user-dropdown";
import type { Session } from "next-auth";
import Link from "next/link";
import { use } from "react";

// This is sample data.
const data = {
	navMain: [
		{
			title: "Modulos",
			url: "#",
			items: [
				{
					title: "Panel",
					url: "/",
					icon: LayoutDashboard,
				},
				{
					title: "Registrar",
					url: "/registrar",
					icon: UserPlus2,
				},
				{
					title: "Registrar Usuario",
					url: "/registrar/usuario",
					icon: UserPlus2,
				},
				{
					title: "Pagos",
					url: "/pagos",
					icon: UserRoundCheck,
				},
			],
		},
	],
};

export function AppSidebar({
	session,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	session: Promise<Session | null>;
}) {
	const pathname = usePathname();
	const userSession = use(session);

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<div className="flex text-left text-sm leading-tight">
								<Image
									src={Logo}
									alt="logo_trapichito"
									width={48}
									height={48}
									className="aspect-square size-10 rounded-lg invert border-2 border-border bg-white"
								/>

								<span className="truncate font-medium">Trapichito</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{/* We create a SidebarGroup for each parent. */}
				{data.navMain.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel className="uppercase text-muted-foreground/60">
							{item.title}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.items.map((item) => {
									if (
										item.url.startsWith("/registrar") &&
										userSession?.user?.role === "representante"
									)
										return null;

									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												className="group/menu-button font-medium gap-3 h-12 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
												isActive={pathname === item.url}
											>
												<Link href={item.url}>
													{item.icon && (
														<item.icon
															className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
															size={18}
															aria-hidden="true"
														/>
													)}
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					{userSession?.user?.role !== "representante" && (
						<SidebarMenuItem>
							<SidebarMenuButton
								className="group/menu-button font-medium gap-3 h-12 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/10 [&>svg]:size-auto"
								asChild
								isActive={pathname.startsWith("/configuracion")}
							>
								<Link href="/configuracion">
									<Settings2
										className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
										size={18}
										aria-hidden="true"
									/>
									<span>Configuración</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)}
					<UserDropdown sessionPromise={session} />
				</SidebarMenu>
				{/* <hr className="border-t border-border mx-2 -mt-px" />
				<SidebarMenu>
				<SidebarMenuItem>
						<SidebarMenuButton className="font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto">
							<LogOut
								className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
								size={22}
								aria-hidden="true"
							/>
							<span>Sign Out</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu> */}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
