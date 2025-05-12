import { getEntityData } from "@/lib/action-data";
import type { Representative } from "@/utils/interfaces/representative";
import RepresentativeResume from "../details/representative";
import type { RegisterData } from "@/store/useRegisterStore";

export default async function ResumeRepresentForm({
	registerData,
}: { registerData: RegisterData }) {
	const representData = await Promise.all([
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
	return ["representative", "mother", "father"].map(
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
	);
}
