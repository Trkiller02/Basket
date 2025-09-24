"use client";

import { RegisterData, useRegisterStore } from "@/store/useRegisterStore";
import { useGetStep } from "@/utils/getStep";
import { relationSchema } from "@/utils/interfaces/schemas";
import { relationSelect } from "@/utils/selectList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectContent,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";

const DialogRepresentative = ({
	open,
	etapa,
}: {
	open: boolean;
	etapa: string;
}) => {
	const { replace } = useRouter();
	const [disKeys, setDisKeys] = useState<Set<string>>(new Set([]));

	const registerData = useRegisterStore((state) => state.registerData);
	const setRegisterData = useRegisterStore((state) => state.setRegisterData);
	const relationSearch = useRegisterStore((state) => state.relationSearch);

	const getStep = useGetStep(etapa, { data: registerData });

	/* const { isOpen, onOpen, onOpenChange } = useDisclosure({
		defaultOpen: open,
		onClose: () => {
			replace(`/registrar?etapa=${getStep() === etapa ? etapa : getStep()}`);
		},
	}); */

	const disabledKeys = useCallback(() => {
		if (
			registerData.mother &&
			!disKeys.has("madre") &&
			registerData.mother !== "omitted"
		) {
			setDisKeys((disKeys) => disKeys.add("madre"));
		}
		if (
			registerData.father &&
			!disKeys.has("padre") &&
			registerData.father !== "omitted"
		) {
			setDisKeys((disKeys) => disKeys.add("padre"));
		}
		if (
			(registerData.representative || registerData.tutor) &&
			!disKeys.has("representante")
		) {
			setDisKeys((disKeys) => disKeys.add("representante"));
		}
	}, [disKeys, registerData]);

	const form = useForm<{
		relation: "mother" | "father" | "representative";
		value: string;
		tutor?: boolean;
	}>({
		resolver: yupResolver(relationSchema),
		defaultValues: {
			relation: "representative",
			value: relationSearch,
		},
	});

	useEffect(() => disabledKeys(), [disabledKeys]);

	const onSubmit = ({
		relation,
		value,
		tutor,
	}: {
		relation: string;
		value: string;
		tutor?: boolean;
	}) => {
		return setRegisterData({
			[relation]: value,
			tutor:
				!registerData.tutor && tutor
					? (relation as RegisterData["tutor"])
					: registerData.tutor,
		});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={() =>
				replace(`/registrar?etapa=${getStep() === etapa ? etapa : getStep()}`)
			}
		>
			<DialogContent>
				<DialogHeader>Relacionar con el atleta:</DialogHeader>
				<Form {...form}>
					<form id="form-modal" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-col md:grid grid-cols-2 gap-3 ">
							<FormField
								control={form.control}
								name="relation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Relación:</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={etapa}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Seleccione una opción" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{relationSelect.map(({ value, key }) => (
													<SelectItem
														key={key}
														value={key}
														disabled={disKeys.has(
															key === "representative"
																? "representante"
																: key === "mother"
																	? "madre"
																	: key === "father"
																		? "padre"
																		: key,
														)}
													>
														{value}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormDescription>
											Ingrese la relación con el atleta.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="tutor"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
											<FormControl>
												<Checkbox
													onCheckedChange={field.onChange}
													defaultChecked={field.value}
													disabled={!!registerData.tutor}
													className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
												/>
											</FormControl>
											<div className="grid gap-1.5 font-normal">
												<p className="text-sm leading-none font-medium">
													Tutor legal
												</p>
												<p className="text-muted-foreground text-sm">
													Responsable del atleta.
												</p>
											</div>
										</FormLabel>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* CI FIELD */}
						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cédula de identidad:</FormLabel>
									<FormControl>
										<div className="flex items-center gap-2 w-full">
											<Select
												disabled
												onValueChange={(value) =>
													field.onChange(value + (field.value?.slice(1) ?? ""))
												}
												defaultValue={field.value?.charAt(0) ?? "V"}
											>
												<SelectTrigger>
													<SelectValue placeholder="V" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="V">V</SelectItem>
													<SelectItem value="E">E</SelectItem>
												</SelectContent>
											</Select>
											<div className="relative">
												<Input
													placeholder="3..."
													type="tel"
													className="peer pe-9"
													required
													readOnly
													defaultValue={field.value?.slice(1) ?? ""}
													onChange={({ target: { value: number } }) =>
														field.onChange(field.value?.slice(0, 1) + number)
													}
												/>
											</div>
										</div>
									</FormControl>
									<FormDescription>Prefijo: V o E. Ej: V30...</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter className="flex justify-between items-center">
					<DialogClose asChild>
						<Button color="danger">Cancelar</Button>
					</DialogClose>
					<Button type="submit" color="primary" form="form-modal">
						Enviar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DialogRepresentative;
