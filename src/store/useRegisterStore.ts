import type { Athlete } from "@/utils/interfaces/athlete";
import type { Health } from "@/utils/interfaces/health";
import type { Representative } from "@/utils/interfaces/representative";

import { create } from "zustand";

export interface RegisterData {
	athlete?: Athlete;
	health?: Health;
	representative?: Representative | "omitted" | string;
	mother?: Representative | "omitted" | string;
	father?: Representative | "omitted" | string;
	tutor?: "representative" | "mother" | "father";
}

interface RegisterStore {
	registerData: RegisterData;
	relationSearch?: string;
	setRegisterData: (data: RegisterData) => void;
	setSessionData: () => void;
	getSessionData: () => void;
	clearRegisterData: () => void;
	setRelationSearch?: (data: string) => void;
	clearRelationSearch?: () => void;
	deleteProperty?: (key: keyof RegisterData) => void;
}

export const useRegisterStore = create<RegisterStore>((set, get) => ({
	registerData: {},
	setRelationSearch: (data: string) => set((_) => ({ relationSearch: data })),
	setRegisterData: (data: RegisterData) =>
		set((state) => ({ registerData: { ...state.registerData, ...data } })),
	setSessionData: () => {
		if (typeof window === "undefined") return;
		localStorage.setItem("registerData", JSON.stringify(get().registerData));
	},
	getSessionData: () => {
		if (typeof window === "undefined") return;

		const data = localStorage.getItem("registerData");

		if (!data) return;

		set((_) => ({ registerData: JSON.parse(data) }));
	},
	clearRegisterData: () => set((_) => ({ registerData: {} })),
	clearRelationSearch: () => set((_) => ({ relationSearch: undefined })),
	deleteProperty: (key: keyof RegisterData) =>
		set(({ registerData }) => ({
			registerData: { ...registerData, [key]: undefined },
		})),
}));
