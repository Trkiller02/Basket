export interface SearchQuery {
	page?: number;
	limit?: number;
	query?: string;
	deleted?: boolean;
}

export type Nullable<T> = T | null | undefined;
