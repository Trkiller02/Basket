import { Divider } from "@heroui/divider";
import Image from "next/image";

export default async function SesionLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<section
			className="flex h-screen justify-around items-center"
			id="auth-layout"
		>
			<Image
				src="/bg-login.jpeg"
				alt="players background"
				className="object-contain h-[90%] w-auto mask-radial-at-center mask-radial-from-100% mask-radial-to-0%"
				width={200}
				height={200}
				priority
			/>
			{children}
		</section>
	);
}
