import type { Representative } from "../interfaces/representative";
import type { DataRequest, Athlete } from "../interfaces/athlete";

export const extractPropsAthlete = (obj: Athlete): DataRequest => {
	const { user_id } = obj;

	return {
		id: obj.id ?? "",
		name: user_id?.name,
		lastname: user_id?.lastname,
		email: user_id?.email,
		image: obj.image,
		phone_number: user_id?.phone_number,
		ci_number: user_id?.ci_number,
		category: obj.category,
		position: obj.position,
		solvent: obj.solvent,
	};
};

export const extractPropsRepresentative = (
	obj: Representative,
): DataRequest => {
	const { user_id } = obj;

	return {
		id: obj.id ?? "",
		name: user_id?.name,
		lastname: user_id?.lastname,
		email: user_id?.email,
		phone_number: user_id?.phone_number,
		ci_number: user_id?.ci_number,
	};
};
