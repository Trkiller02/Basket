"use client";

import { useRegisterStore } from "@/store/useRegisterStore";
import AthleteResume from "../details/athlete";
import { HealthResume } from "../details/health";
import { RepresentativeResume } from "../details/representative";
import { fetchData } from "@/utils/fetchHandler";
import { getEntityData, setEntityData } from "@/lib/action-data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { Representative } from "@/utils/interfaces/representative";
import { use } from "react";
import { regexList } from "@/utils/regexPatterns";

export default function ResumeForm() {
	const registerData = useRegisterStore((state) => state.registerData);
	const clearRegisterData = useRegisterStore(
		(state) => state.clearRegisterData,
	);
	const router = useRouter();

	const registerRepresentative = async (dataRepresentative: Representative) => {
		try {
			const { data, error } = await authClient.admin.createUser({
				email: dataRepresentative.user_id.email,
				name: dataRepresentative.user_id.name,
				password: "123456",
				role: "representante",
				data: {
					lastname: dataRepresentative.user_id.lastname,
					phone_number: dataRepresentative.user_id.phone_number,
					ci_number: dataRepresentative.user_id.ci_number,
				},
			});

			if (Object.keys({}).length !== 0) throw error;

			const response = setEntityData<{ message: string }>("representatives", {
				...dataRepresentative,
				user_id: data?.user.id,
			});

			return response;
		} catch (error) {
			throw error;
		}
	};

	const representData = async (
		entity: "mother" | "father" | "representative",
	) => {
		const data = await getEntityData<Representative>(
			"representatives",
			registerData[entity] as string,
		);

		if (data) return { message: data.id as string };
	};

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
					user_id: {
						...registerData.athlete?.user_id,
						role: "atleta",
					},
				}),
				typeof registerData.representative === "object"
					? registerRepresentative(registerData.representative)
					: registerData.representative?.match(regexList.forDNI)
						? representData("representative")
						: undefined,
				typeof registerData.mother === "object"
					? registerRepresentative(registerData.mother)
					: registerData.mother?.match(regexList.forDNI)
						? representData("mother")
						: undefined,
				typeof registerData.father === "object"
					? registerRepresentative(registerData.father)
					: registerData.father?.match(regexList.forDNI)
						? representData("father")
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
					relation: "representante",
					tutor: registerData.tutor === "representative",
				}),

				registerData.mother !== "omitted"
					? setEntityData("repr-athletes", {
							athlete_id: athlete?.message,
							representative_id: mother?.message ?? registerData.mother,
							relation: "madre",
							tutor: registerData.tutor === "mother",
						})
					: undefined,

				registerData.father !== "omitted"
					? setEntityData("repr-athletes", {
							athlete_id: athlete?.message,
							representative_id: father?.message ?? registerData.father,
							relation: "padre",
							tutor: registerData.tutor === "father",
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

			clearRegisterData();
			router.push("/");
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
					<h4 className="text-2xl text-default-800 font-semibold py-2">
						Representantes:
					</h4>
					{typeof registerData.representative === "string" && (
						<h2 className="text-xl font-bold">
							Representante: {registerData.representative}
						</h2>
					)}
					{registerData.representative &&
						typeof registerData.representative !== "string" && (
							<RepresentativeResume
								data={registerData.representative}
								formView
							/>
						)}
					{typeof registerData.mother === "string" && (
						<h3 className="text-xl font-bold">Madre: {registerData.mother}</h3>
					)}

					{registerData.mother && typeof registerData.mother !== "string" && (
						<RepresentativeResume data={registerData.mother} formView />
					)}

					{typeof registerData.father === "string" && (
						<h3 className="text-xl font-bold">Padre: {registerData.father}</h3>
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
