"use client";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

export const Provider = ({ children }: { children: React.ReactNode }) => (
	<HeroUIProvider locale="es-VE">
		<ToastProvider />
		{children}
	</HeroUIProvider>
);
