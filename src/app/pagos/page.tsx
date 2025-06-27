import InvoicesFormForm from "@/components/payment/athletes-select";

export default function InvoicesPage() {
	const estudiantes = [
		{
			id: "1",
			user_id: {
				ci_number: "V29883112",
				name: "María González",
				lastname: "Fernandez",
				email: "pepe@gamil.com",
			},
			solvent: 0,
		},
		{
			id: "2",
			user_id: {
				ci_number: "V29873113",
				name: "Carlos Rodríguez",
				lastname: "Fernandez",
				email: "pepe@gamil.com",
			},
			solvent: 1,
		},
		{
			id: "3",
			user_id: {
				ci_number: "V29893141",
				name: "Ana Martínez",
				lastname: "Fernandez",
				email: "pepe@gamil.com",
			},
			solvent: 3,
		},
		{
			id: "4",
			user_id: {
				ci_number: "V29843115",
				name: "Luis Fernández",
				lastname: "Fernandez",
				email: "pepe@gamil.com",
			},
			solvent: 0,
		},
	];

	return <InvoicesFormForm pricing={100} />;
}
