import Logo from "@/assets/trapiche.svg";
import BgLogin from "@/assets/bg-login.jpeg";
import Image from "next/image";

export default async function SesionLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<aside className="flex justify-center gap-2 md:justify-start">
					<a href="/" className="flex items-center gap-2 font-medium">
						<Image
							src={Logo}
							alt="logo_trapichito"
							width={46}
							height={46}
							className="aspect-square size-10 rounded-lg invert border-2 border-border bg-white"
						/>
						Trapichito.
					</a>
				</aside>
				<main className="flex flex-1 items-center justify-center">
					<section className="w-full max-w-xs">{children}</section>
				</main>
			</div>
			<div className="bg-muted relative hidden lg:block">
				<Image
					src={BgLogin}
					alt="team_photo"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
}
