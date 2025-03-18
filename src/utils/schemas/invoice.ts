import * as Yup from "yup";
import { Messages } from "../messages";

export const invoiceSchema = Yup.object({
	representative_id: Yup.string().required(Messages.required),
	amount: Yup.number().min(0).required(Messages.required),
	athlete_id: Yup.string().required(Messages.required),
	description: Yup.string().optional(),
	image_path: Yup.string().optional(),
});
