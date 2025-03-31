"use client";

import { useRegisterStore } from "@/store/useRegisterStore";
import AthleteResume from "../details/athlete";
import { HealthResume } from "../details/health";
import { RepresentativeResume } from "../details/representative";
import { fetchData } from "@/utils/fetchHandler";
import { setEntityData } from "@/lib/action-data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResumeForm() {
	const registerData = useRegisterStore((state) => state.registerData);
	const clearRegisterData = useRegisterStore(
		(state) => state.clearRegisterData,
	);
	const router = useRouter();

	const onSubmit = async () => {
		try {
			const fileUpload = await fetchData<{ message: string }>(
				"/api/upload-image",
				{
					method: "POST",
					body: {
						file: registerData.athlete?.image,
						name: registerData.athlete?.user_id.ci_number,
						type: "athletes",
					},
				},
			);

			const [athlete, representative, mother, father] = await Promise.all<
				{ message: string } | undefined
			>([
				setEntityData<{ message: string }>("athletes", {
					...registerData.athlete,
					image: fileUpload?.message,
				}),
				typeof registerData.representative === "object"
					? setEntityData<{ message: string }>("representatives", {
							...registerData.representative,
						})
					: undefined,
				typeof registerData.mother === "object"
					? setEntityData<{ message: string }>("representatives", {
							...registerData.mother,
						})
					: undefined,
				typeof registerData.father === "object"
					? setEntityData<{ message: string }>("representatives", {
							...registerData.father,
						})
					: undefined,
			]);

			await Promise.all([
				setEntityData("health", {
					...registerData.health,
					athlete_id: athlete?.message,
				}),
				setEntityData("repr-athletes", {
					athlete_id: athlete?.message,
					representative_id: representative?.message,
				}),

				registerData.mother !== "omitted"
					? setEntityData("repr-athletes", {
							athlete_id: athlete?.message,
							representative_id: mother?.message ?? registerData.mother,
							relation: "madre",
						})
					: undefined,

				registerData.father !== "omitted"
					? setEntityData("repr-athletes", {
							athlete_id: athlete?.message,
							representative_id: father?.message ?? registerData.father,
							relation: "padre",
						})
					: undefined,
			]);

			/* if (registerData.mother && registerData.mother !== "omitted") {
				if (typeof registerData.mother === "object") {
					const mother = await setEntityData<{ message: string }>(
						"representatives",
						{
							...registerData.mother,
						},
					);

					if (mother)
						await setEntityData("repr-athletes", {
							athlete_id: (athlete?.message,
							representative_id: mother.message,
						});
				}

				if (typeof registerData.mother === "string")
					await setEntityData("repr-athletes", {
						athlete_id: (athlete?.message,
						representative_id: registerData.mother,
					});
			}

			if (registerData.father && registerData.father !== "omitted") {
				if (typeof registerData.father === "object") {
					const father = await setEntityData<{ message: string }>(
						"representatives",
						{
							...registerData.father,
						},
					);

					if (father)
						await setEntityData("repr-athletes", {
							athlete_id: (athlete?.message,
							representative_id: father.message,
						});
				}

				if (typeof registerData.father === "string")
					await setEntityData("repr-athletes", {
						athlete_id: (athlete?.message,
						representative_id: registerData.father,
					});
			} */

			return {
				message: "Registro guardado",
				description: "¡Gracias por completar el formulario!",
			};
		} catch (error) {
			throw {
				message: "Error al guardar datos",
				description: (error as Error).message,
			};
		}
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();

				toast.promise(onSubmit, {
					loading: "Guardando...",
					description: "Por favor espere.",
					success: (data) => {
						return data;
					},
					error: (error) => error,
				});
			}}
			id="resumen-form"
		>
			{registerData ? (
				<>
					{registerData.athlete && (
						<>
							<h4 className="text-2xl text-default-800 font-semibold py-2">
								Atleta:
							</h4>
							<AthleteResume data={registerData.athlete} formView />
						</>
					)}
					{registerData.health && (
						<HealthResume data={registerData.health} formView />
					)}
					{registerData.representative && (
						<>
							<h4 className="text-2xl text-default-800 font-semibold py-2">
								Representantes:
							</h4>
							<RepresentativeResume
								data={registerData.representative}
								formView
							/>
						</>
					)}
					{registerData.mother && typeof registerData.mother !== "string" && (
						<RepresentativeResume data={registerData.mother} formView />
					)}
					{registerData.father && typeof registerData.father !== "string" && (
						<RepresentativeResume data={registerData.father} formView />
					)}
				</>
			) : (
				"Completa el formulario para ver tus datos"
			)}
		</form>
	);
}
