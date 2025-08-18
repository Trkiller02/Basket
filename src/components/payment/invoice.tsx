"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Printer, ImageIcon } from "lucide-react";
import type { Invoices } from "@/utils/interfaces/invoice";
import Image from "next/image";

export function InvoiceCard({ invoice }: { invoice: Invoices }) {
	const formatDate = (dateString?: string) => {
		if (!dateString) return "No especificada";
		return new Date(dateString).toLocaleDateString("es-ES", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
			<div className="max-w-4xl mx-auto">
				<Card className="w-full shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
					<CardHeader className="pb-8 pt-8">
						<div className="flex justify-between items-start mb-6">
							<div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
								<FileText className="h-4 w-4" />
								<span>Detalle de Factura</span>
							</div>
							<div className="flex space-x-3">
								{invoice.verified && (
									<Button
										onClick={() => console.log("imprimir")}
										className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
									>
										<Printer className="h-4 w-4" />
										<span>Imprimir</span>
									</Button>
								)}
							</div>
						</div>

						<div className="flex flex-col items-center space-y-6">
							<div className="text-center">
								<h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
									Factura #{invoice.id}
								</h1>
								<div className="flex justify-center">
									<Badge
										variant={invoice.verified ? "default" : "secondary"}
										className={`text-lg px-4 py-2 ${
											invoice.verified
												? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
												: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
										}`}
									>
										{invoice.verified ? "Verificada" : "Pendiente"}
									</Badge>
								</div>
							</div>

							{invoice.image_path && (
								<div className="w-full max-w-md">
									<Image
										src={invoice.image_path || "/placeholder.svg"}
										alt="Imagen de factura"
										className="w-full h-64 object-cover rounded-lg shadow-lg border-4 border-white dark:border-gray-700"
									/>
								</div>
							)}
						</div>
					</CardHeader>

					<CardContent className="pb-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
								<div className="flex items-center space-x-3 mb-2">
									<User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
										ID del Atleta
									</span>
								</div>
								<p className="text-xl font-medium text-gray-900 dark:text-gray-100 font-mono">
									{invoice.athlete_id}
								</p>
							</div>

							{invoice.representative_id && (
								<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
									<div className="flex items-center space-x-3 mb-2">
										<User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
										<span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
											ID del Representante
										</span>
									</div>
									<p className="text-xl font-medium text-gray-900 dark:text-gray-100 font-mono">
										{invoice.representative_id}
									</p>
								</div>
							)}

							<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
								<div className="flex items-center space-x-3 mb-2">
									<Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
										Fecha de Pago
									</span>
								</div>
								<p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
									{formatDate(invoice.payment_date)}
								</p>
							</div>

							{invoice.description && (
								<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 md:col-span-2">
									<div className="flex items-center space-x-3 mb-2">
										<FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
										<span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
											Descripción
										</span>
									</div>
									<p className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
										{invoice.description}
									</p>
								</div>
							)}

							{!invoice.image_path && (
								<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
									<div className="flex items-center space-x-3 mb-2">
										<ImageIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
										<span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
											Imagen
										</span>
									</div>
									<p className="text-lg text-gray-500 dark:text-gray-400 italic">
										No disponible
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
