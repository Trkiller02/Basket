import type { Athlete } from "@/utils/interfaces/athlete";
import type { Health } from "@/utils/interfaces/health";
import type { Representative } from "@/utils/interfaces/representative";

import { create } from "zustand";

export interface RegisterData {
	athlete?: Athlete;
	health?: Health;
	representative?: Representative;
	mother?: Representative;
	father?: Representative;
}

interface RegisterStore {
	registerData: RegisterData;
	setRegisterData: (data: RegisterData) => void;
}

export const useRegisterStore = create<RegisterStore>((set, get) => ({
	registerData: {},
	setRegisterData: (data: RegisterData) =>
		set((state) => ({ registerData: { ...state.registerData, data } })),
}));
