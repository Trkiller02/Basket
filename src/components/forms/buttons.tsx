"use client";

import { useRegisterStore } from "@/store/useRegisterStore";
import { getStep } from "@/utils/getStep";
import { Button, ButtonGroup } from "@heroui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export const FormButtons = ({ etapa }: { etapa: string }) => {
	const router = useRouter();
	const registerData = useRegisterStore((state) => state.registerData);

	return (
		<div className="flex w-full justify-between">
			<Button type="button" color="danger">
				Cancelar
			</Button>
			<ButtonGroup>
				<Button
					type="button"
					isDisabled={etapa === "atleta"}
					startContent={<ArrowLeft className="py-2" />}
					onPress={() =>
						router.push(
							`/registrar?etapa=${getStep(etapa, { data: registerData, backMode: true })}`,
						)
					}
				>
					Anterior
				</Button>
				<Button
					type="submit"
					form={`${etapa}-form`}
					color="primary"
					endContent={
						etapa === "resumen" ? (
							<Check className="py-2" />
						) : (
							<ArrowRight className="py-2" />
						)
					}
				>
					{etapa === "resumen" ? "Finalizar" : "Próximo"}
				</Button>
			</ButtonGroup>
		</div>
	);
};
