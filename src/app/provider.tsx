"use client";

import { HeroUIProvider } from "@heroui/system";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { Toaster as ToastProvider } from "sonner";
import { fetcher } from "@/lib/action-data";

export const Provider = ({ children }: { children: React.ReactNode }) => (
	<HeroUIProvider locale="es-VE">
		<ToastProvider visibleToasts={4} position="top-center" />
		<SWRConfig value={{ fetcher }}>
			<SessionProvider>{children}</SessionProvider>
		</SWRConfig>
	</HeroUIProvider>
);
