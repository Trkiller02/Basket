export const dateHandler = (a?: string): number => {
	if (!a) return 0;

	const age = Math.floor(
		(new Date().getTime() - new Date(a).getTime()) / 31557600000,
	);

	return age;
};
