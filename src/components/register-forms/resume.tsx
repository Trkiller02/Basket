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

import { useEffect, useState } from "react";
import { MainDialog } from "../details/main-dialog";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";
import { regexList } from "@/utils/regexPatterns";
import { useForm } from "react-hook-form";
import { QRDetails } from "../details/qr-code";
import { PDFPreview } from "../details/pdf-preview";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Separator } from "../ui/separator";

export default function ResumeForm() {
	const form = useForm({});
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const registerData = useRegisterStore((state) => state.registerData);
	const deleteProperty = useRegisterStore((state) => state.deleteProperty);
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <all dependencies are used>
	useEffect(() => {
		if (!data) return;

		const params = new URLSearchParams(searchParams);

		params.append("modal", "true");

		router.push(`${pathname}?${params.toString()}`);
	}, [data]);

	const onSubmit = async () => {
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

		setData({ ...props, athleteId: athleteId ?? "" });

		return {
			message: "Registro guardado",
			description: "¡Gracias por completar el formulario!",
		};
	};

	if (!registerData || !registerData.athlete)
		return <h1>Completa el formulario para ver tus datos</h1>;

	return (
		<form
			onSubmit={form.handleSubmit(() =>
				toast.promise(onSubmit, {
					loading: "Guardando...",
					success: (data) => {
						return data;
					},
					error: (error) => error.message,
				}),
			)}
			id="resumen-form"
			className="flex flex-col gap-4 px-2 w-full"
		>
			<h4 className="text-2xl text-default-800 font-semibold">Atleta:</h4>
			<AthleteResume data={registerData.athlete as Athlete} formView />
			<HealthResume data={registerData.health as Health} formView />

			<h4 className="text-2xl text-default-800 font-semibold pt-4">
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
					entity={"representante"}
					data={reprData ?? (registerData.representative as Representative)}
					formView
					onDelete={() => deleteProperty?.("representative")}
				/>
			)}

			{registerData.mother === "omitted" ? null : motherLoading ? (
				<p>Cargando datos...</p>
			) : (
				<RepresentativeResume
					entity={"madre"}
					data={motherData ?? (registerData.mother as Representative)}
					formView
					onDelete={() => deleteProperty?.("mother")}
				/>
			)}

			{registerData.father === "omitted" ? null : fatherLoading ? (
				<p>Cargando datos...</p>
			) : (
				<RepresentativeResume
					entity={"padre"}
					data={fatherData ?? (registerData.father as Representative)}
					formView
					onDelete={() => deleteProperty?.("father")}
				/>
			)}

			<MainDialog
				onAction={() => {
					clearRegisterData();
					router.push("/");
				}}
			>
				<QRDetails data={data} />
				<PDFPreview urlDownload={`/api/reports/register/${data?.athleteId}`} />
			</MainDialog>
		</form>
	);
}
