"use client";

import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { User } from "@heroui/user";
import {
	Box,
	PenTool,
	TrendingUp,
	Plane,
	MoreHorizontal,
	ChevronLeft,
	ChevronRight,
	ChevronDown,
	Menu,
} from "lucide-react";

import {
	Dumbbell,
	HandCoins,
	LayoutDashboard,
	UserRoundPlus,
	UserRoundSearch,
	UserRound,
	ShieldUser,
	type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItemProps {
	Icon: LucideIcon;
	label: string;
	isNested?: boolean;
	isCollapsed?: boolean;
	children?: React.ReactNode;
}

const NavItem = ({
	Icon,
	label,
	isNested,
	isCollapsed,
	children,
}: NavItemProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={`${isNested ? "ml-4" : ""}`}>
			<Button
				className={`mx-0 text-foreground-800 font-semibold ${!isCollapsed ? "justify-start" : ""}`}
				startContent={<Icon className="size-7 min-w-7 min-h-7" />}
				isIconOnly={isCollapsed}
				fullWidth
				variant="light"
				onPress={() => Boolean(children) && setIsOpen(!isOpen)}
			>
				{!isCollapsed && (
					<>
						<span className="text-left flex-1">{label}</span>
						{Boolean(children) &&
							(isOpen ? (
								<ChevronDown className="py-2" />
							) : (
								<ChevronRight className="py-2" />
							))}
					</>
				)}
			</Button>
			{!isCollapsed && isOpen && (
				<div className="space-y-1 gap-3 pt-1">{children}</div>
			)}
		</div>
	);
};

export const routes = [
	{ name: "Tablero", href: "/tablero", icon: LayoutDashboard },
	{
		name: "Registrar",
		href: "/registrar",
		icon: UserRoundPlus,
		subRoutes: [
			{ name: "Atleta", href: "/registrar/atleta", icon: Dumbbell },
			{
				name: "Representante",
				href: "/registrar/representante",
				icon: ShieldUser,
			},
		],
	},
	{
		name: "Buscar",
		href: "/buscar",
		icon: UserRoundSearch,
		subRoutes: [
			{
				name: "Representante",
				href: "/buscar?ent=representante",
				icon: ShieldUser,
			},
			{ name: "Atleta", href: "/buscar?ent=atleta", icon: Dumbbell },
			{ name: "Usuario", href: "/buscar?ent=usuario", icon: UserRound },
		],
	},
	{
		name: "Pagos",
		href: "/pagos",
		icon: HandCoins,
	},
];

export function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const pathname = usePathname();
	const singleItems = routes.filter((item) => !item.subRoutes);
	const itemsWithSubroutes = routes.filter((item) => item.subRoutes);

	return (
		<aside
			className={`${
				isCollapsed ? "w-[3%]" : "w-[12%]"
			} h-full flex flex-col flex-0 shrink-0 justify-between bg-content2 items-center rounded-2xl m-2 py-2 transition-all duration-150 ease-in-out overflow-x-hidden border-2 border-content3 `}
		>
			<nav className="space-y-2">
				<Button
					fullWidth
					isIconOnly={isCollapsed}
					className="text-foreground-800"
					variant="light"
					onPress={() => setIsCollapsed(!isCollapsed)}
					startContent={
						isCollapsed ? (
							<Menu className="size-7 min-w-7 min-h-7" />
						) : (
							<Box className="size-7 min-w-7 min-h-7" />
						)
					}
					endContent={
						!isCollapsed && <ChevronLeft className="size-5 min-w-5 min-h-5" />
					}
				>
					{!isCollapsed && (
						<span className="font-semibold text-lg flex-1 text-left">
							Acme Inc
						</span>
					)}
				</Button>
				<Divider />

				{singleItems.map((item, key) => (
					<NavItem
						key={key.toString()}
						Icon={item.icon}
						label={item.name}
						isCollapsed={isCollapsed}
					/>
				))}
				{itemsWithSubroutes.map((item, key) => (
					<NavItem
						key={key.toString()}
						Icon={item.icon}
						label={item.name}
						isCollapsed={isCollapsed}
					>
						{item.subRoutes?.map((subroute, key) => (
							<NavItem
								key={key.toString()}
								Icon={subroute.icon}
								label={subroute.name}
								isNested
								isCollapsed={isCollapsed}
							/>
						))}
					</NavItem>
				))}

				<div className="pt-4">
					<div className={"text-small"}>
						{!isCollapsed ? "Projects" : <Divider />}
					</div>
					<div className="mt-2">
						<NavItem
							Icon={PenTool}
							label="Design Engineering"
							isCollapsed={isCollapsed}
						/>
						<NavItem
							Icon={TrendingUp}
							label="Sales & Marketing"
							isCollapsed={isCollapsed}
						/>
						<NavItem Icon={Plane} label="Travel" isCollapsed={isCollapsed} />
						<NavItem
							Icon={MoreHorizontal}
							label="More"
							isCollapsed={isCollapsed}
						/>
					</div>
				</div>
			</nav>

			<User
				avatarProps={{
					fallback: "SC",
					className: "min-w-8 min-h-8 size-8",
				}}
				name={isCollapsed ? "" : "shadcn"}
				description={isCollapsed ? "" : "m@example.com"}
				className={`w-full justify-start ml-4${!isCollapsed ? "" : ""}`}
			/>
		</aside>
	);
}
