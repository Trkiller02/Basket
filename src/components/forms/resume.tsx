"use client";

import { type RegisterData, useRegisterStore } from "@/store/useRegisterStore";
import AthleteResume from "../details/athlete";
import { HealthResume } from "../details/health";
import { RepresentativeResume } from "../details/representative";
import { fetchData } from "@/utils/fetchHandler";
import { setEntityData } from "@/lib/action-data";
import { addToast } from "@heroui/toast";

export default function ResumeForm() {
	const registerData = useRegisterStore((state) => state.registerData);

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

			const [athlete, representative] = await Promise.allSettled([
				setEntityData("athletes", {
					...registerData.athlete,
					image: fileUpload?.message,
				}),
				setEntityData("representatives", { ...registerData.representative }),
			]);

			if (athlete.status === "rejected" || representative.status === "rejected")
				throw new Error(athlete.reason ?? representative.reason);

			if (
				athlete.status === "fulfilled" &&
				representative.status === "fulfilled"
			) {
				const [health, reprAthletes] = await Promise.allSettled([
					setEntityData("health", {
						...registerData.health,
						athlete_id: (athlete.value as { message: string }).message,
					}),
					setEntityData("repr-athletes", {
						athlete_id: (athlete.value as { message: string }).message,
						representative_id: (representative.value as { message: string })
							.message,
					}),
				]);

				if (
					health.status === "fulfilled" &&
					reprAthletes.status === "fulfilled"
				)
					addToast({
						title: "Registro guardado",
						description: "¡Gracias por completar el formulario!",
						color: "success",
					});
			}

			if (registerData.mother && registerData.mother !== "omitted") {
				const mother = await setEntityData<{ message: string }>(
					"representatives",
					{
						...registerData.mother,
					},
				);

				if (mother)
					await setEntityData("repr-athletes", {
						athlete_id: (athlete.value as { message: string }).message,
						representative_id: mother.message,
					});
			}

			if (registerData.father && registerData.father !== "omitted") {
				const father = await setEntityData<{ message: string }>(
					"representatives",
					{
						...registerData.father,
					},
				);

				if (father)
					await setEntityData("repr-athletes", {
						athlete_id: (athlete.value as { message: string }).message,
						representative_id: father.message,
					});
			}
		} catch (error) {
			addToast({
				title: "Error al guardar datos",
				description: error.message,
				color: "danger",
			});
		}
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit();
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
					{registerData.mother && registerData.mother !== "omitted" && (
						<RepresentativeResume data={registerData.mother} formView />
					)}
					{registerData.father && registerData.father !== "omitted" && (
						<RepresentativeResume data={registerData.father} formView />
					)}
				</>
			) : (
				"Completa el formulario para ver tus datos"
			)}
		</form>
	);
}
