import RegistrationForm from "@/components/reports/create-athlete";
import { db } from "@/lib/db";
import {
	athletes,
	health,
	athletes_representatives,
	representatives,
	users,
} from "@drizzle/schema";
import { renderToStream } from "@react-pdf/renderer";
import { and, eq, isNull } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;

	const relation = await db
		.select()
		.from(athletes_representatives)
		.where(eq(athletes_representatives.athlete_id, id));

	if (relation.length === 0)
		return NextResponse.json({ message: "No se encontró el athlete" });

	const mapRelation = relation.map((item) => ({
		relation: item.relation,
		representative_id: item.representative_id,
	}));

	const idxMother = mapRelation.findIndex((item) => item.relation === "madre");
	const idxFather = mapRelation.findIndex((item) => item.relation === "padre");

	const [[athlete], [healthData], mother, father] = await Promise.all([
		db
			.select({
				id: athletes.id,
				user_id: {
					name: users.name,
					lastname: users.lastname,
					ci_number: users.ci_number,
					email: users.email,
				},
				age: athletes.age,
				birth_date: athletes.birth_date,
				birth_place: athletes.birth_place,
				address: athletes.address,
			})
			.from(athletes)
			.innerJoin(users, eq(athletes.user_id, users.id))
			.where(and(eq(athletes.id, id), isNull(users.deleted_at))),
		db.select().from(health).where(eq(health.athlete_id, id)),
		idxMother === -1
			? undefined
			: db
					.select({
						user_id: {
							name: users.name,
							lastname: users.lastname,
							phone_number: users.phone_number,
						},
						occupation: representatives.occupation,
						height: representatives.height,
					})
					.from(representatives)
					.innerJoin(users, eq(representatives.user_id, users.id))
					.where(
						and(
							eq(representatives.id, mapRelation[idxMother].representative_id),
							isNull(users.deleted_at),
						),
					),
		idxFather === -1
			? undefined
			: db
					.select({
						user_id: {
							name: users.name,
							lastname: users.lastname,
							phone_number: users.phone_number,
						},
						occupation: representatives.occupation,
						height: representatives.height,
					})
					.from(representatives)
					.innerJoin(users, eq(representatives.user_id, users.id))
					.where(
						and(
							eq(representatives.id, mapRelation[idxFather].representative_id),
							isNull(users.deleted_at),
						),
					),
	]);

	console.log(father, mother, { idxMother, idxFather });

	const stream = await renderToStream(
		<RegistrationForm
			data={{
				athlete,
				healthData,
				father: Array.isArray(father) ? father[0] : undefined,
				mother: Array.isArray(mother) ? mother[0] : undefined,
			}}
		/>,
	);

	return new NextResponse(stream as unknown as ReadableStream, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="inscripcion_${athlete.user_id.ci_number}.pdf"`,
		},
	});
};
