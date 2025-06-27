"use client";

import { BackupButton } from "@/components/config/backup-button";
import { RestoreButton } from "@/components/config/restore-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
	Info,
	Upload,
	Download,
	DatabaseZap,
	ChevronRight,
} from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function ConfigurationPage() {
	return (
		<div className="container mx-auto py-8">
			<h3 className="text-3xl font-semibold flex items-center gap-2 justify-between">
				Seguridad de Datos:
				<DatabaseZap className="size-8" />
			</h3>
			<Separator className="my-4" />

			{/* Instructions */}
			<Collapsible>
				<CollapsibleTrigger className="flex items-center gap-2 text-lg font-semibold justify-between px-2 py-4 w-full">
					<h3 className="flex items-center gap-2">
						<Info className="size-6" />
						Instrucciones de Uso
					</h3>
					<ChevronRight className="size-6" />
				</CollapsibleTrigger>
				<CollapsibleContent className="space-y-4 transition-all duration-300 ease-in-out">
					<Card>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<h4 className="font-medium mb-2">
										Para crear una copia de seguridad:
									</h4>
									<ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
										<li>Haz clic en "Descargar Backup SQL"</li>
										<li>El archivo se descargará automáticamente</li>
										<li>Guarda el archivo en un lugar seguro</li>
									</ol>
								</div>

								<div>
									<h4 className="font-medium mb-2">
										Para restaurar una copia de seguridad:
									</h4>
									<ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
										<li>Selecciona un archivo .sql</li>
										<li>Haz clic en "Restaurar Base de Datos"</li>
										<li>Espera a que se complete el proceso</li>
										<li>Revisa los resultados y errores si los hay</li>
									</ol>
								</div>
							</div>

							<h4 className="font-medium mb-2 text-lg px-2">
								Comandos alternativos (línea de comandos):
							</h4>
							<div className="bg-muted p-4 rounded-lg border border-border">
								<div className="space-y-4 flex flex-col md:grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm font-medium px-2">
											Copia de seguridad:
										</p>
										<code className="text-sm bg-background p-2 rounded-md block border border-border ps-4">
											pg_dump -U (usuario) -h (host) -d (nombre_db) &gt;
											(nombre_archivo).sql
										</code>
									</div>
									<div>
										<p className="text-sm font-medium px-2">Restaurar:</p>
										<code className="text-sm bg-background p-2 rounded-md block border border-border ps-4">
											psql -U (usuario) -h (host) -d (nombre_db) &lt;
											(nombre_archivo).sql
										</code>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<Separator className="my-6" />
				</CollapsibleContent>
			</Collapsible>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Backup Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Download className="h-5 w-5" />
							Backup de Base de Datos
						</CardTitle>
						<CardDescription>
							Descarga un copia de seguridad completo de tu base de datos en
							formato SQL
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert>
							<Info className="size-6" />
							<AlertDescription>
								El copia de seguridad incluye estructura de tablas, datos,
								constraints y claves primarias/foráneas.
							</AlertDescription>
						</Alert>

						<div className="flex flex-col gap-2">
							<BackupButton />
							<p className="text-sm text-muted-foreground">
								El archivo se descargará como copia de seguridad_YYYY-MM-DD.sql
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Restore Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Upload className="h-5 w-5" />
							Restaurar Base de Datos
						</CardTitle>
						<CardDescription>
							Sube un archivo SQL para restaurar tu base de datos
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert variant="destructive">
							<Info className="size-6" />
							<AlertDescription>
								<strong>¡Precaución!</strong>
								El restore puede sobrescribir datos existentes.{" "}
								<b>
									<em>
										Asegúrate de hacer un copia de seguridad antes de continuar.
									</em>
								</b>
							</AlertDescription>
						</Alert>

						<RestoreButton />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
