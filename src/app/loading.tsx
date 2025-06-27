export default function Loading() {
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-4 text-center">
				<h1 className="text-2xl font-bold">Cargando...</h1>
				<p className="text-muted-foreground text-sm text-balance">
					Espere mientras cargamos la aplicación
				</p>
			</div>
		</div>
	);
}
