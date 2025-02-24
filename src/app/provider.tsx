import { HeroUIProvider } from "@heroui/system";

export const Provider = ({ children }: { children: React.ReactNode }) => (
	<HeroUIProvider className="w-full min-h-screen">{children}</HeroUIProvider>
);
