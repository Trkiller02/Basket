"use client";

import { useRegisterStore } from "@/store/useRegisterStore";
import { relationSchema } from "@/utils/interfaces/schemas";
import { relationSelect } from "@/utils/selectList";
import { Button } from "@heroui/button";
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

	const { isOpen, onOpen, onOpenChange } = useDisclosure({
		defaultOpen: open,
		onClose: () => {
			replace(`/registrar?etapa=${etapa}`);
		},
	});

	const registerData = useRegisterStore((state) => state.registerData);
	const setRegisterData = useRegisterStore((state) => state.setRegisterData);
	const relationSearch = useRegisterStore((state) => state.relationSearch);

	const disabledKeys = useCallback(() => {
		if (registerData.mother && !disKeys.has("madre")) {
			setDisKeys((disKeys) => disKeys.add("madre"));
		}
		if (registerData.father && !disKeys.has("padre")) {
			setDisKeys((disKeys) => disKeys.add("padre"));
		}
		if (registerData.representative && !disKeys.has("representante")) {
			setDisKeys((disKeys) => disKeys.add("representante"));
		}
	}, [disKeys, registerData]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => disabledKeys(), [registerData]);

	const form = useForm({
		criteriaMode: "firstError",
		mode: "all",
		resolver: yupResolver(relationSchema),
	});

	const onSubmit = ({
		relation,
		value,
	}: { relation: string; value: string }) => {
		setRegisterData({ [relation]: value });
	};

	return (
		<Modal
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
								<Select
									items={relationSelect}
									label="Relación:"
									name="relation"
									defaultSelectedKeys={[etapa]}
									disabledKeys={Array.from(disKeys)}
									description={"Ingrese la relación con el atleta."}
									isRequired
								>
									{({ value, key }: { value: string; key: string }) => (
										<SelectItem key={key}>{value}</SelectItem>
									)}
								</Select>

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
