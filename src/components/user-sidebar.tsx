"use client";

import { User } from "@heroui/user";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function UserSidebar({
	isCollapsed = false,
}: { isCollapsed?: boolean }) {
	const { data: session, status } = useSession();
	const router = useRouter();

	return status === "loading" ? (
		<p>Loading...</p>
	) : (
		<Dropdown>
			<DropdownTrigger>
				<User
					avatarProps={{
						fallback: session?.user?.name.charAt(0),
						className: "min-w-8 min-h-8 size-8",
					}}
					name={isCollapsed ? "" : session?.user?.name}
					description={isCollapsed ? "" : session?.user?.email}
					className={`w-full justify-start ml-4${!isCollapsed ? "" : ""}`}
				/>
			</DropdownTrigger>
			<DropdownMenu>
				<DropdownItem
					key="logout"
					onPress={async () =>
						await signOut({
							redirect: true,
							redirectTo: "/sesion/iniciar",
						})
					}
					color="danger"
					description="Se cerrará la sesión actual"
					shortcut="⌘⇧D"
				>
					Cerrar sesión
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
