import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "../ui/tooltip";
import { Toaster as ToastProvider } from "sonner";

export const Providers = async ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const session = await auth();

	return (
		<SessionProvider session={session}>
			<TooltipProvider>{children}</TooltipProvider>
			<ToastProvider />
		</SessionProvider>
	);
};
