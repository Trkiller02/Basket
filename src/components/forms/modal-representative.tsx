"use client";

import { useRegisterStore } from "@/store/useRegisterStore";
import { useGetStep } from "@/utils/getStep";
import { relationSchema } from "@/utils/interfaces/schemas";
import { relationSelect } from "@/utils/selectList";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import {
	Modal,
	ModalContent,
	ModalBody,
	ModalHeader,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { cn } from "@heroui/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const ModalRepresentative = ({
	open,
	etapa,
}: { open: boolean; etapa: string }) => {
	const { replace } = useRouter();
	const [disKeys, setDisKeys] = useState<Set<string>>(new Set([]));

	const registerData = useRegisterStore((state) => state.registerData);
	const setRegisterData = useRegisterStore((state) => state.setRegisterData);
	const relationSearch = useRegisterStore((state) => state.relationSearch);

	const getStep = useGetStep(etapa, { data: registerData });

	const { isOpen, onOpen, onOpenChange } = useDisclosure({
		defaultOpen: open,
		onClose: () => {
			replace(`/registrar?etapa=${getStep() === etapa ? etapa : getStep()}`);
		},
	});

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

	const form = useForm({
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

		onOpenChange();
	};

	return (
		<Modal
			size="lg"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			backdrop="opaque"
			classNames={{
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>Modal title</ModalHeader>
						<ModalBody>
							<form id="form-modal" onSubmit={form.handleSubmit(onSubmit)}>
								<div className="flex flex-col md:grid grid-cols-2 gap-3 ">
									<Controller
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
									/>
									<Controller
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
															{error
																? error.message
																: "Responsable del atleta."}
														</span>
													</div>
												</Checkbox>
											);
										}}
									/>
								</div>

								<Controller
									control={form.control}
									name="value"
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											isRequired
											label="Cédula de identidad:"
											isInvalid={!!error}
											errorMessage={error?.message}
											defaultValue={relationSearch}
											description="V30... ó E23..."
											isReadOnly
										/>
									)}
								/>
							</form>
						</ModalBody>
						<ModalFooter className="flex justify-between items-center">
							<Button onPress={onClose} color="danger">
								Cancelar
							</Button>
							<Button type="submit" color="primary" form="form-modal">
								Enviar
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ModalRepresentative;
