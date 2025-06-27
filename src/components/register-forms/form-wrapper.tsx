"use client";

import { useRegisterStore } from "@/store/useRegisterStore";
import { useEffect } from "react";

export const FormWrapper = ({ children }: { children: React.ReactNode }) => {
	const registerData = useRegisterStore((state) => state.registerData);
	const getSessionData = useRegisterStore((state) => state.getSessionData);
	const setSessionData = useRegisterStore((state) => state.setSessionData);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <once first render to get session data>
	useEffect(() => {
		getSessionData();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <just executes when registerData changes>
	useEffect(() => {
		setSessionData();
	}, [registerData]);

	return children;
};
