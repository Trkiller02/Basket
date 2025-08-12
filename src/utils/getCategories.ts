export const categories = Object.freeze([
	"Pulguitas",
	"U12",
	"U14",
	"U16",
	"U18",
]);

export const getCategories = (age: number) => {
	if (age >= 5 && age <= 10) return categories[0];
	if (age >= 11 && age <= 12) return categories[1];
	if (age >= 13 && age <= 14) return categories[2];
	if (age >= 15 && age <= 16) return categories[3];
	if (age >= 17 && age <= 18) return categories[4];
};
