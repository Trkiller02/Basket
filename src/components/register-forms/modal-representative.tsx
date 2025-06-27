"use client";

import { useRegisterStore } from "@/store/useRegisterStore";
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
}: { open: boolean; etapa: string }) => {
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
		if (registerData.mother && !disKeys.has("madre")) {
			setDisKeys((disKeys) => disKeys.add("madre"));
		}
		if (registerData.father && !disKeys.has("padre")) {
			setDisKeys((disKeys) => disKeys.add("padre"));
		}
		if (
			(registerData.representative || registerData.tutor) &&
			!disKeys.has("representante")
		) {
			setDisKeys((disKeys) => disKeys.add("representante"));
		}
	}, [disKeys, registerData]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => disabledKeys(), [registerData]);

	const form = useForm<{
		relation: "madre" | "padre" | "representante";
		value: string;
		tutor?: boolean;
	}>({
		resolver: yupResolver(relationSchema),
		defaultValues: {
			relation: "representante",
			value: relationSearch,
		},
	});

	const onSubmit = ({
		relation,
		value,
		tutor,
	}: { relation: string; value: string; tutor?: boolean }) => {
		if (relation === "madre")
			return setRegisterData({
				mother: value,
				tutor: !registerData.tutor && tutor ? "mother" : registerData.tutor,
			});
		if (relation === "padre")
			return setRegisterData({
				father: value,
				tutor: !registerData.tutor && tutor ? "father" : registerData.tutor,
			});

		setRegisterData({ representative: value, tutor: "representative" });
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
														key={value}
														value={value}
														disabled={disKeys.has(value)}
													>
														{key}
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

							{/* <Controller
							control={form.control}
							name="relation"
							render={({ field, fieldState: { error } }) => (
								<Select
									{...field}
									items={relationSelect}
									label="Relación:"
									defaultSelectedKeys={[etapa]}
									disabledKeys={Array.from(disKeys)}
									description={"Ingrese la relación con el atleta."}
									isInvalid={!!error}
									errorMessage={error?.message}
									isRequired
								>
									{({ value, key }: { value: string; key: string }) => (
										<SelectItem key={key}>{value}</SelectItem>
									)}
								</Select>
							)}
						/> */}
							{/* <Controller
								control={form.control}
								name="tutor"
								render={({ field, fieldState: { error } }) => {
									const { value, ...restField } = field;
									return (
										<Checkbox
											{...restField}
											isSelected={
												form.watch("relation") === "representante"
													? true
													: value
											}
											isInvalid={!!error}
											classNames={{
												base: cn(
													"bg-default-100",
													"hover:bg-default-200",
													"r rounded-xl m-1 border-2 border-transparent",
													"data-[selected=true]:border-primary",
												),
												label: "w-full",
											}}
										>
											<div className="flex flex-col items-start">
												<p>Tutor legal</p>
												<span
													className={`text-tiny ${error ? "text-danger" : "text-default-800"}`}
												>
													{error ? error.message : "Responsable del atleta."}
												</span>
											</div>
										</Checkbox>
									);
								}}
							/> */}
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
