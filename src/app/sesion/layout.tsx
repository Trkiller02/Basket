import { Divider } from "@heroui/divider";
import Image from "next/image";

export default async function SesionLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<section
			className="flex h-screen justify-center items-center"
			id="auth-layout"
		>
			<div className="relative flex md:grid grid-cols-2 md:w-1/2 gap-4 border-2 border-primary bg-content1 rounded-xl shadow-md mx-4 h-3/5">
				<div className="relative max-md:hidden w-full h-full">
					<Image
						src="/bg-login.jpeg"
						alt="players background"
						className="object-cover"
						fill
						priority
					/>
				</div>
				{children}
			</div>
		</section>
	);
}
