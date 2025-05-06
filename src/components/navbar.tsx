"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Link } from "@heroui/link";
import {
	DropdownItem,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import Image from "next/image";
import { Button } from "@heroui/button";
import { ChevronDown, Dribbble, User2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function NavBar() {
	const { data: session, isPending } = useSession();

	return (
		<Navbar>
			<NavbarBrand>
				<Image src="/trapiche.svg" alt="Trapichito" width={100} height={50} />
			</NavbarBrand>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<Dropdown>
					<NavbarItem>
						<DropdownTrigger>
							<Button
								disableRipple
								className="p-0 bg-transparent data-[hover=true]:bg-transparent"
								endContent={<ChevronDown className="py-2" />}
								radius="sm"
								variant="light"
							>
								Registrar
							</Button>
						</DropdownTrigger>
					</NavbarItem>
					<DropdownMenu
						aria-label="Registered Features"
						itemClasses={{
							base: "gap-4",
						}}
					>
						<DropdownItem
							key="athlete"
							description="Jugador que se incorporará a la Escuela"
							startContent={<Dribbble className="py-2" />}
							as={Link}
							href="/registrar?etapa=atleta"
						>
							Atleta
						</DropdownItem>
						<DropdownItem
							key="user"
							description="Representante/Usuario que se incorporará a la Escuela"
							startContent={<User2 className="py-2" />}
							as={Link}
							href="/registrar/usuario"
						>
							Usuario
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
				<NavbarItem isActive>
					<Link aria-current="page" href="#">
						Pagos
					</Link>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent as="div" justify="end">
				{!session || isPending ? (
					<NavbarItem className="hidden lg:flex">
						<Link href="/sesion/iniciar">Login</Link>
					</NavbarItem>
				) : (
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Avatar
								isBordered
								as="button"
								className="transition-transform"
								color="primary"
								name={session?.user.name}
								size="sm"
							/>
						</DropdownTrigger>
						<DropdownMenu aria-label="Profile Actions" variant="flat">
							<DropdownItem key="profile" className="h-14 gap-2">
								<p className="font-semibold">Saludos {session?.user.name}!</p>
								<p className="font-semibold">{session?.user.email}</p>
							</DropdownItem>
							<DropdownItem key="notifications">Notificaciones</DropdownItem>
							<DropdownItem key="profile">Información personal</DropdownItem>
							<DropdownItem key="configurations">Configuración</DropdownItem>
							<DropdownItem key="logout" color="danger">
								Cerrar sesión
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				)}
			</NavbarContent>
		</Navbar>
	);
}
