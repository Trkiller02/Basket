export const getCategories = (age: number) => {
	if (age >= 5 && age <= 10) return "Pulguitas";
	if (age >= 11 && age <= 12) return "U12";
	if (age >= 13 && age <= 14) return "U14";
	if (age >= 15 && age <= 16) return "U16";
	if (age >= 17 && age <= 18) return "U18";
};
