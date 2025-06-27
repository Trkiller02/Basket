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
	Barcode,
	LayoutDashboard,
	LeafIcon,
	LogOut,
	ScanLine,
	Settings2,
	UserRoundCheck,
} from "lucide-react";

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
					icon: Barcode,
				},
				{
					title: "Pagos",
					url: "/pagos",
					icon: UserRoundCheck,
					isActive: true,
				},

				{
					title: "",
					url: "#",
					icon: LeafIcon,
				},
			],
		},
		{
			title: "Other",
			url: "#",
			items: [
				{
					title: "Settings",
					url: "#",
					icon: Settings2,
				},
				{
					title: "Help Center",
					url: "#",
					icon: LeafIcon,
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Image
								src={Logo}
								alt="logo_trapichito"
								width={46}
								height={46}
								className="aspect-square size-10 rounded-lg invert border-2 border-border bg-white"
							/>

							<div className="grid flex-1 text-left text-sm leading-tight">
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
						<SidebarGroupContent className="px-2">
							<SidebarMenu>
								{item.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
											isActive={item.isActive}
										>
											<a href={item.url}>
												{item.icon && (
													<item.icon
														className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
														size={22}
														aria-hidden="true"
													/>
												)}
												<span>{item.title}</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<hr className="border-t border-border mx-2 -mt-px" />
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
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
