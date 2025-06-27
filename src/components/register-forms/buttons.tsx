"use client";

import { useRegisterStore } from "@/store/useRegisterStore";
import { useGetStep } from "@/utils/getStep";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

const FormButtons = ({ etapa }: { etapa: string }) => {
	const router = useRouter();
	const registerData = useRegisterStore((state) => state.registerData);
	const getStep = useGetStep(etapa, { data: registerData, backMode: true });

	return (
		<div className="flex w-full justify-between">
			<Button type="button" color="danger">
				Cancelar
			</Button>
			<div className="flex gap-2">
				<Button
					type="button"
					disabled={etapa === "atleta"}
					onClick={() => router.replace(`/registrar?etapa=${getStep()}`)}
				>
					<ArrowLeft className="p-2" />
					Anterior
				</Button>
				<Button type="submit" form={`${etapa}-form`} color="primary">
					{etapa === "resumen" ? "Finalizar" : "Próximo"}
					{etapa === "resumen" ? (
						<Check className="p-2" />
					) : (
						<ArrowRight className="p-2" />
					)}
				</Button>
			</div>
		</div>
	);
};

export default memo(FormButtons);
