import type { Athlete, UserTable } from "../interfaces/athlete";
import type { Representative } from "../interfaces/representative";

export const ExtractUserProps = (
	obj:
		| Partial<
				Pick<Athlete, "category" | "position" | "solvent" | "user_id" | "id">
		  >
		| Pick<Representative, "user_id" | "id">,
): UserTable => {
	const { user_id, ...rest } = obj;

	return {
		id: obj.id ?? "",
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		...user_id!,
		...rest,
	};
};
