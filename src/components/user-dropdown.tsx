import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Group, LogOut, Settings2 } from "lucide-react";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { use } from "react";

export default function UserDropdown({
	session,
}: { session: Promise<Session | null> }) {
	const data = use(session);

	// if (!data) return redirect("/sesion/iniciar");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
					<Avatar className="size-9">
						<AvatarImage
							src={data?.user?.image}
							width={32}
							height={32}
							alt="Profile image"
						/>
						<AvatarFallback>{data?.user?.name.charAt(0)}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="max-w-64" align="end">
				<DropdownMenuLabel className="flex min-w-0 flex-col">
					<span className="truncate text-sm font-medium text-foreground">
						Keith Kennedy
					</span>
					<span className="truncate text-xs font-normal text-muted-foreground">
						k.kennedy@originui.com
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Settings2 size={16} className="opacity-60" aria-hidden="true" />
						<span>Account settings</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Group size={16} className="opacity-60" aria-hidden="true" />
						<span>Affiliate area</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
				/* onClick={() => {
						"use server";
						console.log("Sign out");
					}} */
				>
					<LogOut size={16} className="opacity-60" aria-hidden="true" />
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
