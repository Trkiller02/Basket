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
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItemProps {
	Icon: LucideIcon;
	label: string;
	isNested?: boolean;
	isCollapsed?: boolean;
	children?: React.ReactNode;
	href?: string;
}

const NavItem = ({
	Icon,
	href,
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
				href={href}
				as={Link}
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
	{ name: "Tablero", href: "/", icon: LayoutDashboard },
	{
		name: "Registrar",
		href: "/registrar",
		icon: UserRoundPlus,
		subRoutes: [
			{ name: "Atleta", href: "/registrar?etapa=atleta", icon: Dumbbell },
			{
				name: "Representante",
				href: "/registrar?etapa=representante",
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
							<div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full">
								<Image src="/trapiche.svg" fill alt="Trapichito" />
							</div>
						)
					}
					endContent={
						!isCollapsed && <ChevronLeft className="size-5 min-w-5 min-h-5" />
					}
				>
					{!isCollapsed && (
						<span className="font-semibold text-lg flex-1 text-left">
							Trapichito
						</span>
					)}
				</Button>
				<Divider />

				{singleItems.map((item, key) => (
					<NavItem
						key={key.toString()}
						Icon={item.icon}
						label={item.name}
						href={item.href ?? "#"}
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
								href={subroute.href}
								isNested
								isCollapsed={isCollapsed}
							/>
						))}
					</NavItem>
				))}
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
