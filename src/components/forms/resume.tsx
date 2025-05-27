"use client";

import { useRegisterStore } from "@/store/useRegisterStore";
import AthleteResume from "../details/athlete";
import { HealthResume } from "../details/health";
import RepresentativeResume from "../details/representative";
import { fetchData } from "@/utils/fetchHandler";
import { getEntityData, setEntityData } from "@/lib/action-data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Representative } from "@/utils/interfaces/representative";
import type { Athlete } from "@/utils/interfaces/athlete";
import type { Health } from "@/utils/interfaces/health";

import { useEffect, useState } from "react";
import { regexList } from "@/utils/regexPatterns";
import bcrypt from "bcryptjs";
import ModalSecurity from "../auth/modal-security";

export default function ResumeForm() {
	const registerData = useRegisterStore((state) => state.registerData);
	const clearRegisterData = useRegisterStore(
		(state) => state.clearRegisterData,
	);
	const [data, setData] = useState<{
		password: string;
		restore_code: string;
		name: string;
	}>();
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const [representData, setRepresentData] = useState<
		(Representative | undefined)[]
	>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const f = async () => {
			const representDataPromise = await Promise.all([
				...["representative", "mother", "father"].map((type: string) => {
					const key = type as "representative" | "mother" | "father";

					if (
						typeof registerData[key] === "string" &&
						registerData[key] !== "omitted"
					)
						return getEntityData<Representative>(
							"representatives",
							registerData[key] as string,
						);
				}),
			]);
			setRepresentData(representDataPromise);
		};

		f();
	}, []);

	const registerRepresentative = async (
		type: "representative" | "mother" | "father",
	) => {
		if (!registerData[type] || registerData[type] === "omitted")
			return undefined;

		if (typeof registerData[type] === "string") {
			const data = await getEntityData<Representative>(
				"representatives",
				registerData[type] as string,
			);

			if (!data) throw new Error("Representante no encontrado");

			return { message: data.id as string };
		}

		const keygen = crypto.randomUUID();

		const password = keygen.slice(0, 6);
		const restore_code = keygen.slice(6, 12);

		const response = await setEntityData<{ message: string }>(
			"representatives",
			{
				...(registerData[type] as Representative),
				user_id: {
					...(registerData[type] as Representative).user_id,
					...(registerData.tutor !== type
						? {}
						: {
								password,
								restore_code: await bcrypt.hash(restore_code, 10),
								role: "representante",
							}),
				},
			},
		);

		return {
			message: response?.message ?? "",
			props: { name: registerData[type].user_id.name, password, restore_code },
		};
	};

	const onSubmit = async () => {
		try {
			const fileUpload = registerData.athlete?.image
				? await fetchData<{ message: string }>("/api/upload-image", {
						method: "POST",
						body: {
							file: registerData.athlete?.image,
							name: registerData.athlete?.user_id.ci_number,
							type: "athletes",
						},
					})
				: undefined;

			const [athlete, ...representPromises] = await Promise.all<
				| {
						message: string;
						props?: { name: string; password: string; restore_code: string };
				  }
				| undefined
			>([
				setEntityData<{ message: string }>("athletes", {
					...registerData.athlete,
					image: fileUpload?.message,
					user_id: {
						...registerData.athlete?.user_id,
						role: "atleta",
					},
				}),
				...["representative", "mother", "father"].map((type: string) =>
					registerRepresentative(
						type as "representative" | "mother" | "father",
					),
				),
			]);

			await Promise.all([
				setEntityData("health", {
					...registerData.health,
					athlete_id: athlete?.message,
				}),
				...["representative", "mother", "father"].map(
					(type: string, index: number) => {
						const key = type as "representative" | "mother" | "father";

						if (!representPromises[index]) return undefined;

						return setEntityData("repr-athletes", {
							athlete_id: athlete?.message,
							representative_id: representPromises[index]?.message,
							relation:
								key === "representative"
									? "representante"
									: key === "mother"
										? "madre"
										: "padre",
							tutor: registerData.tutor === key,
						});
					},
				),
			]);

			const idxAccountRepresent = representPromises.findIndex(
				(item) => item?.props,
			);

			setData(representPromises[idxAccountRepresent]?.props);
			setIsOpen(true);
			clearRegisterData();

			return {
				message: "Registro guardado",
				description: "¡Gracias por completar el formulario!",
				id: athlete?.message,
			};
		} catch (error) {
			throw {
				message: "Error al guardar datos",
				description: (error as Error).message,
			};
		}
	};

	if (!registerData || !registerData.athlete)
		return "Completa el formulario para ver tus datos";

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();

				return toast.promise(onSubmit, {
					loading: "Guardando...",
					description: "Por favor espere.",
					success: (data) => {
						return {
							...data,
							action: {
								label: "Imprimir",
								onClick: async () =>
									await fetch(`/api/reports/register/${data.id}`),
							},
						};
					},
					error: (error) => error.message,
				});
			}}
			id="resumen-form"
		>
			<h4 className="text-2xl text-default-800 font-semibold py-2">Atleta:</h4>
			<AthleteResume data={registerData.athlete as Athlete} formView />
			<HealthResume data={registerData.health as Health} formView />

			<h4 className="text-2xl text-default-800 font-semibold py-2">
				Representantes:
			</h4>
			{typeof registerData.representative === "string" &&
				(registerData.mother === "omitted"
					? null
					: representData[0] && (
							<RepresentativeResume
								data={representData[0] as Representative}
								formView
							/>
						))}
			{typeof registerData.representative === "object" && (
				<RepresentativeResume data={registerData.representative} formView />
			)}
			{typeof registerData.mother === "string" &&
				(registerData.mother !== "omitted"
					? null
					: representData[1] && (
							<RepresentativeResume
								data={representData[1] as Representative}
								formView
							/>
						))}

			{typeof registerData.mother === "object" && (
				<RepresentativeResume data={registerData.mother} formView />
			)}

			{typeof registerData.father === "string" &&
				(registerData.father !== "omitted"
					? null
					: representData[2] && (
							<RepresentativeResume
								data={representData[2] as Representative}
								formView
							/>
						))}
			{typeof registerData.father === "object" && (
				<RepresentativeResume data={registerData.father} formView />
			)}
			{/* {["representative", "mother", "father"].map(
				(type: string, index: number) => {
					const key = type as "representative" | "mother" | "father";

					if (typeof registerData[key] !== "object" && !representData[index])
						return null;

					return (
						<RepresentativeResume
							key={index.toString()}
							data={
								typeof registerData[key] === "object"
									? registerData[key]
									: (representData[index] as Representative)
							}
							formView
						/>
					);
				},
			)} */}

			<ModalSecurity
				isOpenProp={isOpen}
				setIsOpenAction={setIsOpen}
				data={data}
			/>
		</form>
	);
}
