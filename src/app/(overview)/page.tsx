import { Card, CardBody } from "@heroui/card";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from "@heroui/table";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Calendar, ClipboardCheck, Plus, Trophy, Users } from "lucide-react";

export default function HomePage() {
	const students = [
		{
			id: 1,
			name: "Carlos Rodriguez",
			age: 15,
			category: "U16",
			solvent: "active",
		},
		{
			id: 2,
			name: "Maria Garcia",
			age: 14,
			category: "U16",
			solvent: "active",
		},
		{
			id: 3,
			name: "Juan Martinez",
			age: 16,
			category: "U16",
			solvent: "inactive",
		},
	];

	const upcomingEvents = [
		{
			id: 1,
			title: "Torneo local",
			date: "2024-03-15",
			type: "tournament",
		},
		{
			id: 2,
			title: "Prueba de habilidades",
			date: "2024-03-20",
			type: "assessment",
		},
	];
	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto py-4 px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Card>
						<CardBody>
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-full bg-primary-100">
									<Users className="text-2xl text-primary-500" />
								</div>
								<div>
									<p className="text-small text-default-500">Total atletas</p>
									<p className="text-2xl font-bold">45</p>
								</div>
							</div>
						</CardBody>
					</Card>

					<Card>
						<CardBody>
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-full bg-success-100">
									<Calendar className="text-2xl text-success-500" />
								</div>
								<div>
									<p className="text-small text-default-500">Turnos activos</p>
									<p className="text-2xl font-bold">2</p>
								</div>
							</div>
						</CardBody>
					</Card>

					<Card>
						<CardBody>
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-full bg-warning-100">
									<Trophy className="text-2xl text-warning-500" />
								</div>
								<div>
									<p className="text-small text-default-500">
										Eventos próximos
									</p>
									<p className="text-2xl font-bold">{upcomingEvents.length}</p>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
					<Card className="xl:col-span-2">
						<CardBody>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-lg font-bold">Atletas recientes</h2>
							</div>
							{/* <Table removeWrapper aria-label="Recent students table">
								<TableHeader>
									<TableColumn>Nombre</TableColumn>
									<TableColumn>Edad</TableColumn>
									<TableColumn>Categoria</TableColumn>
									<TableColumn>Solvencia</TableColumn>
								</TableHeader>
								<TableBody>
									{students.map((student) => (
										<TableRow key={student.id}>
											<TableCell>
												<User
													name={student.name}
													avatarProps={{
														fallback: student.name.slice(0, 1),
													}}
												/>
											</TableCell>
											<TableCell>{student.age}</TableCell>
											<TableCell>{student.category}</TableCell>
											<TableCell>
												<Chip
													color={
														student.solvent === "active" ? "success" : "danger"
													}
													variant="flat"
													size="sm"
												>
													{student.solvent}
												</Chip>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table> */}
						</CardBody>
					</Card>

					<Card>
						<CardBody>
							<h2 className="text-lg font-bold mb-4">Proximos eventos</h2>
							<div className="space-y-4">
								{upcomingEvents.map((event) => (
									<div
										key={event.id}
										className="flex items-start gap-4 p-4 rounded-lg bg-content1"
									>
										<div className="p-2 rounded-full bg-primary-100">
											{event.type === "tournament" ? (
												<Trophy className="text-xl text-primary-500" />
											) : (
												<ClipboardCheck className="text-xl text-primary-500" />
											)}
										</div>
										<div>
											<h3 className="font-semibold">{event.title}</h3>
											<p className="text-small text-default-500">
												{event.date}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardBody>
					</Card>
				</div>
			</main>
		</div>
	);
}
