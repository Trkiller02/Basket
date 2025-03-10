import type { Athlete } from "@/utils/interfaces/athlete";
import type { Health } from "@/utils/interfaces/health";
import type { Representative } from "@/utils/interfaces/representative";

import { create } from "zustand";

export interface RegisterData {
	athlete?: Athlete;
	health?: Health;
	representative?: Representative;
	mother?: Representative | "omitted";
	father?: Representative | "omitted";
}

interface RegisterStore {
	registerData: RegisterData;
	setRegisterData: (data: RegisterData) => void;
	setSessionData: () => void;
	getSessionData: () => void;
}

export const useRegisterStore = create<RegisterStore>((set, get) => ({
	registerData: {},
	setRegisterData: (data: RegisterData) =>
		set((state) => ({ registerData: { ...state.registerData, ...data } })),
	setSessionData: () => {
		if (typeof window === "undefined") return;
		sessionStorage.setItem("registerData", JSON.stringify(get().registerData));
	},
	getSessionData: () => {
		if (typeof window === "undefined") return;

		const data = sessionStorage.getItem("registerData");

		if (!data) return;

		set((state) => ({ registerData: JSON.parse(data) }));
	},
}));
