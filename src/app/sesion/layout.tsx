import { Divider } from "@heroui/divider";
import Image from "next/image";

export default async function SesionLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<section className="flex h-screen justify-center items-center">
			<div className="flex flex-row items-center justify-center w-9/12 p-4 border-2 rounded-3xl border-default-500">
				{/* 
					<h2 className="font-medium text-2xl absolute">
						¡Bienvenido, que bueno tenerte por acá!
					</h2> */}
				<Image
					src="/trapiche.svg"
					alt="logo"
					className="object-contain w-1/2 border-r-2 border-default-500"
					width={100}
					height={100}
					priority
				/>

				{children}
			</div>
		</section>
	);
}
