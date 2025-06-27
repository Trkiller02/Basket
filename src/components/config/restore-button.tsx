"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface RestoreResult {
	success: boolean;
	message: string;
	executedStatements: number;
	totalStatements: number;
	errors?: string[];
}

export function RestoreButton() {
	const [isUploading, setIsUploading] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(
		null,
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (!file.name.endsWith(".sql")) {
				toast.error(
					<div className="flex items-center gap-2">
						<p className="text-sm font-medium">Archivo inválido</p>
						<p className="text-sm text-muted-foreground">
							Por favor selecciona un archivo con extensión .sql
						</p>
					</div>,
				);
				return;
			}
			setSelectedFile(file);
			setRestoreResult(null);
		}
	};

	const handleRestore = async () => {
		if (!selectedFile) {
			toast.error(
				<div className="flex items-center gap-2">
					<p className="text-sm font-medium">No hay archivo</p>
					<p className="text-sm text-muted-foreground">
						Por favor selecciona un archivo SQL primero.
					</p>
				</div>,
			);
			return;
		}

		setIsUploading(true);
		setRestoreResult(null);

		try {
			const formData = new FormData();
			formData.append("sqlFile", selectedFile);

			const response = await fetch("/api/restore", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (response.ok) {
				setRestoreResult(result);
				toast.error(
					<div className="flex items-center gap-2">
						<p className="text-sm font-medium">Restore completado</p>
						<p className="text-sm text-muted-foreground">{result.message}</p>
					</div>,
				);
			} else {
				throw new Error(result.error || "Error desconocido");
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error(
				<div className="flex items-center gap-2">
					<p className="text-sm font-medium">Error en el restore</p>
					<p className="text-sm text-muted-foreground">
						No se pudo completar el restore.
					</p>
				</div>,
			);
		} finally {
			setIsUploading(false);
		}
	};

	const resetForm = () => {
		setSelectedFile(null);
		setRestoreResult(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="sql-file">Archivo SQL de Backup</Label>
				<Input
					ref={fileInputRef}
					id="sql-file"
					type="file"
					accept=".sql"
					onChange={handleFileSelect}
					disabled={isUploading}
				/>
				{selectedFile && (
					<p className="text-sm text-muted-foreground">
						Archivo seleccionado: {selectedFile.name} (
						{(selectedFile.size / 1024).toFixed(1)} KB)
					</p>
				)}
			</div>

			<div className="flex gap-2">
				<Button
					onClick={handleRestore}
					disabled={!selectedFile || isUploading}
					className="gap-2"
				>
					{isUploading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Upload className="h-4 w-4" />
					)}
					{isUploading ? "Restaurando..." : "Restaurar Base de Datos"}
				</Button>

				{selectedFile && (
					<Button variant="outline" onClick={resetForm} disabled={isUploading}>
						Cancelar
					</Button>
				)}
			</div>

			{restoreResult && (
				<div className="space-y-2">
					<Alert
						className={
							restoreResult.success
								? "border-green-200 bg-green-50"
								: "border-red-200 bg-red-50"
						}
					>
						<AlertTriangle className="h-4 w-4" />
						<AlertDescription>
							<div className="space-y-1">
								<p className="font-medium">{restoreResult.message}</p>
								<p className="text-sm">
									Statements ejecutados: {restoreResult.executedStatements} de{" "}
									{restoreResult.totalStatements}
								</p>
							</div>
						</AlertDescription>
					</Alert>

					{restoreResult.errors && restoreResult.errors.length > 0 && (
						<Alert variant="destructive">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>
								<div className="space-y-1">
									<p className="font-medium">Errores encontrados:</p>
									<ul className="text-sm space-y-1">
										{restoreResult.errors.slice(0, 3).map((error, index) => (
											<li
												key={index.toString()}
												className="list-disc list-inside"
											>
												{error}
											</li>
										))}
										{restoreResult.errors.length > 3 && (
											<li className="text-muted-foreground">
												... y {restoreResult.errors.length - 3} errores más
											</li>
										)}
									</ul>
								</div>
							</AlertDescription>
						</Alert>
					)}
				</div>
			)}
		</div>
	);
}
