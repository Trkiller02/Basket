import { Divider } from "@heroui/divider";
import Image from "next/image";

export default async function SesionLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<section className="flex h-screen justify-around items-center">
			<Image
				src="/trapiche.svg"
				alt="logo"
				className="object-contain h-4/5 w-auto"
				width={200}
				height={200}
				priority
			/>
			{children}
		</section>
	);
}
