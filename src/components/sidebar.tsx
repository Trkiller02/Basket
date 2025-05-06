"use client";

import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import {
	ChevronLeft,
	ChevronRight,
	ChevronDown,
	Menu,
	Dribbble,
} from "lucide-react";

import {
	Dumbbell,
	HandCoins,
	LayoutDashboard,
	UserRoundPlus,
	ShieldUser,
	type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import UserSidebar from "./user-sidebar";
import Image from "next/image";

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
		name: "Pagos",
		href: "/pagos",
		icon: HandCoins,
	},
];

export function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const singleItems = useMemo(
		() => routes.filter((item) => !item.subRoutes),
		[],
	);
	const itemsWithSubroutes = useMemo(
		() => routes.filter((item) => item.subRoutes),
		[],
	);

	return (
		<aside
			className={`${
				isCollapsed ? "w-[3%]" : "w-[10%]"
			} h-full flex flex-col shrink-0 justify-between items-center py-2 transition-all duration-150 ease-in-out overflow-x-hidden border-r-1 border-default-200 `}
		>
			<nav className="flex flex-col gap-2">
				{/* <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full">
					<Image src="/trapiche.svg" fill alt="Trapichito" />
				</div> */}
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
							<Dribbble className="size-7 min-w-7 min-h-7" />
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

			<UserSidebar isCollapsed={isCollapsed} />
		</aside>
	);
}
