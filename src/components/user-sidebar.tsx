"use client";

import { User } from "@heroui/user";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function UserSidebar({
	isCollapsed = false,
}: { isCollapsed?: boolean }) {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	return isPending ? (
		<p>Loading...</p>
	) : (
		<Dropdown>
			<DropdownTrigger>
				<User
					avatarProps={{
						fallback: `${session?.user.name[0]}${session?.user.lastname[0]}`,
						className: "min-w-8 min-h-8 size-8",
					}}
					name={
						isCollapsed
							? ""
							: `${session?.user.name.split(" ")[0]} ${session?.user.lastname.split(" ")[0]}`
					}
					description={isCollapsed ? "" : session?.user.email}
					className={`w-full justify-start ml-4${!isCollapsed ? "" : ""}`}
				/>
			</DropdownTrigger>
			<DropdownMenu>
				<DropdownItem
					key="logout"
					onPress={async () =>
						await authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									router.push("/sesion/iniciar"); // redirect to login page
								},
							},
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
