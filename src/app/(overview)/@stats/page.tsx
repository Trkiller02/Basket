import { athletes, users } from "@drizzle/schema";
import { and, eq, isNull, not } from "drizzle-orm";
import { BellDot, CircleDollarSign, Dribbble, Users } from "lucide-react";
import { memo } from "react";
import { StatsGrid } from "@/components/stats-grid";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { adminEntitiesList } from "@/utils/getEntity";

const Stats = memo(async () => {
	const session = await auth();

	if (!adminEntitiesList.has(session?.user.role ?? "")) return null;

	const [solvencia, usuarios, atletas, procesando] = await Promise.all([
		db.$count(athletes, eq(athletes.solvent, 1)),
		db.$count(
			users,
			and(not(eq(users.role, "atleta")), isNull(users.deleted_at)),
		),
		db.$count(users, and(eq(users.role, "atleta"), isNull(users.deleted_at))),
		db.$count(athletes, eq(athletes.solvent, 2)),
	]);

	return (
		<StatsGrid
			stats={[
				{
					title: "Usuarios",
					value: usuarios.toString(),
					icon: <Users />,
				},
				{
					title: "Atletas",
					value: atletas.toString(),
					icon: <Dribbble />,
				},
				{
					title: "Solvencia",
					value: solvencia.toString(),
					icon: <CircleDollarSign />,
				},
				{
					title: "Solvencia en proceso",
					value: procesando.toString(),
					icon: <BellDot />,
				},
			]}
		/>
	);
});

export default Stats;
