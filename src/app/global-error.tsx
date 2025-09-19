"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Error boundaries must be Client Components

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const { back } = useRouter();

	return (
		// global-error must include html and body tags
		<html lang="es">
			<body className="flex h-[100dvh] w-full flex-col items-center justify-center">
				<section className="flex flex-col items-center justify-center gap-4 p-4">
					<h2 className="text-2xl font-bold">¿Algo salió mal!</h2>
					<p>
						Lo siento:&nbsp;
						<i>
							<strong>{error.message}</strong>
						</i>
					</p>

					<div className="flex gap-3">
						<Button onClick={() => reset()} variant={"secondary"}>
							Reintentar
						</Button>
						<Button onClick={() => back()} variant="outline">
							Volver a la página anterior
						</Button>
					</div>
				</section>
			</body>
		</html>
	);
}
