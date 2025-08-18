"use client";

import { useRegisterStore } from "@/store/useRegisterStore";
import AthleteResume from "../details/athlete";
import { HealthResume } from "../details/health";
import RepresentativeResume from "../details/representative";
import { fetchData } from "@/utils/fetchHandler";
import { registerTransaction } from "@/lib/db-data";
import { toast } from "sonner";

import type { Representative } from "@/utils/interfaces/representative";
import type { Athlete } from "@/utils/interfaces/athlete";
import type { Health } from "@/utils/interfaces/health";

import { useState } from "react";
import { MainDialog } from "../details/main-dialog";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";
import { regexList } from "@/utils/regexPatterns";
import { useForm } from "react-hook-form";
import { QRDetails } from "../details/qr-code";
import { PDFPreview } from "../details/pdf-preview";

export default function ResumeForm() {
	const form = useForm({});

	const registerData = useRegisterStore((state) => state.registerData);
	const clearRegisterData = useRegisterStore(
		(state) => state.clearRegisterData,
	);

	const [data, setData] = useState<
		| {
				password: string;
				restore_code: string;
				name: string;
				athleteId: string;
		  }
		| undefined
	>(undefined);

	const { data: reprData, isLoading: reprLoading } = useSWR<Representative>(
		typeof registerData.representative === "string" &&
			registerData.representative.match(regexList.forDNI)
			? `/api/representatives/${registerData.representative}`
			: null,
		fetcher,
	);
	const { data: motherData, isLoading: motherLoading } = useSWR<Representative>(
		typeof registerData.mother === "string" &&
			registerData.mother.match(regexList.forDNI)
			? `/api/representatives/${registerData.mother}`
			: null,
		fetcher,
	);
	const { data: fatherData, isLoading: fatherLoading } = useSWR<Representative>(
		typeof registerData.father === "string" &&
			registerData.father.match(regexList.forDNI)
			? `/api/representatives/${registerData.father}`
			: null,
		fetcher,
	);

	/* 	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
	}, []); */

	/* 	const registerRepresentative = async (
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
	}; */

	const onSubmit = async () => {
		try {
			const fileUpload = registerData.athlete?.user_id.image
				? await fetchData<{ message: string }>("/api/upload-image", {
						method: "POST",
						body: {
							file: registerData.athlete?.user_id.image,
							name: registerData.athlete?.user_id.ci_number,
							type: "athletes",
						},
					})
				: undefined;

			const { props, athleteId } = await registerTransaction({
				...registerData,
				athlete: {
					...(registerData.athlete as Athlete),
					user_id: {
						...(registerData.athlete?.user_id as Athlete["user_id"]),
						image: fileUpload?.message,
					},
				},
			});

			/* 
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
			); */

			setData({ ...props, athleteId });

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

	if (!registerData || !registerData.athlete)
		return "Completa el formulario para ver tus datos";

	return (
		<form
			onSubmit={form.handleSubmit(() =>
				toast.promise(onSubmit, {
					loading: "Guardando...",
					success: (data) => {
						clearRegisterData();
						return data;
					},
					error: (error) => error.message,
				}),
			)}
			id="resumen-form"
		>
			<h4 className="text-2xl text-default-800 font-semibold py-2">Atleta:</h4>
			<AthleteResume data={registerData.athlete as Athlete} formView />
			<HealthResume data={registerData.health as Health} formView />

			<h4 className="text-2xl text-default-800 font-semibold py-2">
				Representantes:
			</h4>
			{/* {typeof registerData.representative === "string" &&
				(registerData.mother === "omitted"
					? null
					: representData && (
							<RepresentativeResume
								data={representData as Representative}
								formView
							/>
						))} */}
			{registerData.representative === "omitted" ? null : reprLoading ? (
				<p>Cargando datos...</p>
			) : (
				<RepresentativeResume
					data={reprData ?? (registerData.representative as Representative)}
					formView
				/>
			)}

			{/* 
			{typeof registerData.mother === "string" &&
				(registerData.mother !== "omitted"
					? null
					: motherData && (
							<RepresentativeResume
								data={motherData as Representative}
								formView
							/>
						))}
{typeof registerData.mother === "object" && (
	<RepresentativeResume data={registerData.mother} formView />
)}
 */}

			{registerData.mother === "omitted" ? null : motherLoading ? (
				<p>Cargando datos...</p>
			) : (
				<RepresentativeResume
					data={motherData ?? (registerData.mother as Representative)}
					formView
				/>
			)}

			{/* {typeof registerData.father === "string" &&
				(registerData.father !== "omitted"
					? null
					: fatherData && (
							<RepresentativeResume
								data={fatherData as Representative}
								formView
							/>
						))}
			{typeof registerData.father === "object" && (
				<RepresentativeResume data={registerData.father} formView />
			)} */}

			{registerData.father === "omitted" ? null : fatherLoading ? (
				<p>Cargando datos...</p>
			) : (
				<RepresentativeResume
					data={fatherData ?? (registerData.father as Representative)}
					formView
				/>
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

			<MainDialog>
				<QRDetails data={data} />
				<PDFPreview urlDownload={`/api/reports/register/${data?.athleteId}`} />
			</MainDialog>
		</form>
	);
}
