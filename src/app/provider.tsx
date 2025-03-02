"use client";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

export const Provider = ({ children }: { children: React.ReactNode }) => (
	<HeroUIProvider className="w-full min-h-screen" locale="es-VE">
		<ToastProvider />
		{children}
	</HeroUIProvider>
);
