"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, LogOut, Pencil, UserCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";

import type { Session } from "next-auth";
import { memo } from "react";

export const UserDropdown = memo(({ session }: { session: Session | null }) => {
	const { isMobile } = useSidebar();

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar className="h-8 w-8 rounded-full border-2 border-gray-700">
							<AvatarImage
								src={session?.user?.image ?? ""}
								width={32}
								height={32}
								alt="Profile image"
							/>
							<AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-md leading-tight">
							<span className="truncate font-medium">
								{session?.user?.name}
							</span>
							<span className="truncate text-xs text-muted-foreground">
								{session?.user?.email}
							</span>
						</div>
						<EllipsisVertical className="ml-auto size-4" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
					side={isMobile ? "bottom" : "right"}
					align="end"
					sideOffset={4}
				>
					<DropdownMenuLabel className="flex min-w-0 items-center gap-2">
						<UserCircle size={16} className="opacity-60" aria-hidden="true" />
						<span className="truncate text-sm font-medium text-foreground">
							{session?.user?.role?.toUpperCase()}
						</span>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link href="/configuracion/perfil">
								<Pencil size={16} className="opacity-60" aria-hidden="true" />
								<span>Información personal</span>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							signOut({ redirect: true, redirectTo: "/sesion/iniciar" });
						}}
					>
						<LogOut size={16} className="opacity-60" aria-hidden="true" />
						<span>Cerrar sesión</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
});
