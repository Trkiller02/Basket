import type { SearchQuery } from "@/utils/interfaces/search";
import type { CreateRepresentativeDto } from "./dto/create-representative.dto";
import type { UpdateRepresentativeDto } from "./dto/update-representative.dto";

import { db } from "@/lib/db";
import { representatives } from "@drizzle/schema";
import { users } from "@drizzle/schema";
import { and, eq, ilike, isNotNull, isNull } from "drizzle-orm";

export class RepresentativeService {
	async create(body: CreateRepresentativeDto) {
		const { user_id, ...rest } = body;

		const [{ userId }] = await db
			.insert(users)
			.values(user_id)
			.returning({ userId: users.id });

		const [{ id }] = await db
			.insert(representatives)
			.values({ ...rest, user_id: userId })
			.returning({ id: representatives.id });

		return { message: id };
	}

	async findMany(querys?: SearchQuery) {
		const { limit, page, query, deleted } = querys ?? {};

		const result = await db
			.select({
				id: representatives.id,
				user_id: {
					id: users.id,
					ci_number: users.ci_number,
					name: users.name,
					lastname: users.lastname,
					email: users.email,
					phone_number: users.phone_number,
				},
				occupation: representatives.occupation,
			})
			.from(representatives)
			.innerJoin(users, eq(representatives.user_id, users.id))
			.where(
				and(
					query
						? ilike(
								query?.includes("@") ? users.email : users.ci_number,
								`%${query ?? ""}%`,
							)
						: undefined,
					deleted ? isNotNull(users.deleted_at) : isNull(users.deleted_at),
				),
			)
			.limit(limit ?? 10)
			.offset((page ?? 1) - 1);

		if (result.length === 0)
			throw { message: "No representatives found", code: 404 };

		return result;
	}

	async findOne(id: string, query: { deleted?: boolean } = { deleted: false }) {
		const [result] = await db
			.select({
				id: representatives.id,
				user_id: {
					id: users.id,
					ci_number: users.ci_number,
					name: users.name,
					lastname: users.lastname,
					email: users.email,
					phone_number: users.phone_number,
				},
				occupation: representatives.occupation,
			})
			.from(representatives)
			.innerJoin(users, eq(representatives.user_id, users.id))
			.where(
				and(
					eq(
						id?.includes("@")
							? users.email
							: id.includes("-")
								? representatives.id
								: users.ci_number,
						id ?? "",
					),
					query?.deleted
						? isNotNull(users.deleted_at)
						: isNull(users.deleted_at),
				),
			);

		if (!result) throw { message: "No representative found", code: 404 };

		return result;
	}

	async update(id: string, body: UpdateRepresentativeDto) {
		if (!body || Object.keys(body).length === 0)
			throw { message: "No body provided", code: 400 };

		const { user_id, ...restBody } = body;

		const representative = await this.findOne(id);

		if (restBody) {
			await db
				.update(representatives)
				.set(restBody)
				.where(eq(representatives.id, id));
		}

		if (user_id) {
			await db
				.update(users)
				.set(user_id)
				.where(eq(users.id, representative.user_id.id));
		}

		return { message: "Representative updated successfully" };
	}

	async remove(id: string) {
		const user = await this.findOne(id);

		await db
			.update(users)
			.set({ deleted_at: new Date().toISOString() })
			.where(eq(users.id, user.user_id.id));

		return { message: `DELETED ${id}` };
	}
}
