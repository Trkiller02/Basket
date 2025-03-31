"use client";

import { HeroUIProvider } from "@heroui/system";
import { Toaster as ToastProvider } from "sonner";

export const Provider = ({ children }: { children: React.ReactNode }) => (
	<HeroUIProvider locale="es-VE">
		<ToastProvider visibleToasts={4} position="top-center" />
		{children}
	</HeroUIProvider>
);
