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
import { authClient, useSession } from "@/lib/auth-client";

export default function NavBar() {
	const { data: session, isPending } = useSession();

	return (
		<Navbar maxWidth="full" className="flex justify-between items-center">
			<NavbarBrand>
				<Image src="/trapiche.svg" alt="Trapichito" width={45} height={45} />
			</NavbarBrand>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				{session?.user.role !== "representante" ? (
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
								color="default"
								description="Jugador que se incorporará a la Escuela"
								startContent={<Dribbble className="py-2" />}
								as={Link}
								href="/registrar?etapa=atleta"
							>
								Atleta
							</DropdownItem>
							<DropdownItem
								key="user"
								color="default"
								description="Representante/Usuario que se incorporará a la Escuela"
								startContent={<User2 className="py-2" />}
								as={Link}
								href="/usuario/registrar"
							>
								Usuario
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				) : null}
				<NavbarItem>
					<Link aria-current="page" href="/pagos">
						Pagos
					</Link>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent as="div" justify="end">
				{!session || isPending ? (
					<NavbarItem className="hidden lg:flex">
						<Button as={Link} href="/sesion/iniciar" variant="faded">
							Iniciar Sesión
						</Button>
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
								<p className="font-semibold">
									Saludos {session?.user.name.split(" ")[0]}!
								</p>
								<p className="font-semibold">{session?.user.email}</p>
							</DropdownItem>
							{session?.user.role !== "representante" ? (
								<DropdownItem
									key="notifications"
									as={Link}
									href="/notificaciones"
								>
									Notificaciones
								</DropdownItem>
							) : null}

							<DropdownItem key="configurations" href="/configuracion">
								Configuración
							</DropdownItem>
							<DropdownItem
								key="logout"
								color="danger"
								onPress={() => authClient.signOut()}
							>
								Cerrar sesión
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				)}
			</NavbarContent>
		</Navbar>
	);
}
