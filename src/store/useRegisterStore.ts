import { create } from "zustand";

interface RegisterData {
	athlete: string;
	representative: string;
	mother: string;
	father: string;
}

interface RegisterStore {
	registerData: RegisterData;
	setRegisterData: (data: RegisterData) => void;
}

export const useRegisterStore = create<RegisterStore>((set, get) => ({
	registerData: {
		athlete: "",
		representative: "",
		mother: "",
		father: "",
	},
	setRegisterData: (data: RegisterData) =>
		set((state) => ({ registerData: { ...state.registerData, data } })),
}));
