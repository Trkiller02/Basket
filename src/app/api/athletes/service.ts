/* import type { SearchQuery } from "@/utils/interfaces/search";
import type { CreateAthletesDto } from "./dto/create-athletes.dto";
import { athletes, users } from "@drizzle/schema";
import { and, eq, ilike, isNotNull, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import type { UpdateAthletesDto } from "./dto/update-athletes.dto";

export class AthletesService {
	async create(body: CreateAthletesDto) {
		const { user_id, ...rest } = body;

		const [{ userId }] = await db
			.insert(users)
			.values(user_id)
			.returning({ userId: users.id });

		const [{ id }] = await db
			.insert(athletes)
			.values({ ...rest, user_id: userId })
			.returning({ id: athletes.id });

		return { message: id };
	}

	async findMany(querys?: SearchQuery) {
		const { limit, page, query, deleted } = querys ?? {};

		const result = await db
			.select({
				id: athletes.id,
				user_id: {
					id: users.id,
					ci_number: users.ci_number,
					name: users.name,
					lastname: users.lastname,
					email: users.email,
					phone_number: users.phone_number,
				},
				age: athletes.age,
				solvent: athletes.solvent,
			})
			.from(athletes)
			.innerJoin(users, eq(athletes.user_id, users.id))
			.where(
				and(
					query
						? ilike(
								query.includes("@") ? users.email : users.ci_number,
								`%${query}%`,
							)
						: undefined,
					deleted ? isNotNull(users.deleted_at) : isNull(users.deleted_at),
				),
			)
			.limit(limit ?? 10)
			.offset((page ?? 1) - 1);

		if (result.length === 0) throw { message: "No athletes found", code: 404 };

		return JSON.stringify(result);
	}

	async findOne(id: string, query: { deleted?: boolean } = { deleted: false }) {
		const [result] = await db
			.select({
				id: athletes.id,
				user_id: {
					id: users.id,
					ci_number: users.ci_number,
					name: users.name,
					lastname: users.lastname,
					email: users.email,
					phone_number: users.phone_number,
				},
				address: athletes.address,
				age: athletes.age,
				solvent: athletes.solvent,
			})
			.from(athletes)
			.innerJoin(users, eq(athletes.user_id, users.id))
			.where(
				and(
					eq(
						id?.includes("@")
							? users.email
							: id.includes("-")
								? athletes.id
								: users.ci_number,
						id ?? "",
					),
					query?.deleted
						? isNotNull(users.deleted_at)
						: isNull(users.deleted_at),
				),
			);

		if (!result) throw { message: "No athlete found", code: 404 };

		return result;
	}

	async update(id: string, body: UpdateAthletesDto) {
		if (!body || Object.keys(body).length === 0)
			throw { message: "No body provided", code: 400 };

		const { user_id, ...restBody } = body;

		const athlete = await this.findOne(id);

		if (restBody) {
			await db.update(athletes).set(restBody).where(eq(athletes.id, id));
		}

		if (user_id) {
			await db
				.update(users)
				.set(user_id)
				.where(eq(users.id, athlete.user_id.id));
		}

		return { message: "Athlete updated successfully" };
	}

	async delete(id: string) {
		const user = await this.findOne(id);

		await db
			.update(users)
			.set({ deleted_at: new Date().toISOString() })
			.where(eq(users.id, user.user_id.id));

		return { message: `DELETED ${id}` };
	}
}
 */
