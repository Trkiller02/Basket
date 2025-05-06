import type { Athlete } from "./athlete";
import type { Representative } from "./representative";

export interface Invoices {
	id: number;
	payment_date?: string;
	representative_id?: string;
	description?: string;
	athlete_id: string;
	image_path?: string;
}

export interface DataInvoices {
	id: string;
	payment_date: string;
	representative_id?: Representative;
	description?: string;
	athlete_id: Athlete;
}

export interface CreateInvoices {
	representative_id?: string;
	description?: string;
	athlete_id: string;
	image_path?: string;
}
