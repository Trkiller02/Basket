"use server";

import type { RegisterData } from "@/store/useRegisterStore";
import { regexList } from "@/utils/regexPatterns";
import { db } from "./db";
import {
	athletes,
	athletes_representatives,
	health,
	history,
	representatives,
	users,
	type historyTypes,
} from "@drizzle/schema";
import type { Representative } from "@/utils/interfaces/representative";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const registerTransaction = async (data: RegisterData) => {
	const {
		athlete,
		health: healthData,
		representative,
		mother,
		father,
		tutor,
	} = data;

	if (!athlete) throw new Error("Datos del atleta no especificados");
	if (!healthData) throw new Error("Datos de la salud no especificados");

	const genkey = crypto.randomUUID();
	const password = genkey.slice(0, 6);
	const restore_code = genkey.slice(6, 12);

	/* try {
		const [athleteId, reprId, motherId, fatherId] = await Promise.all<
			{ message: string } | undefined
		>([
			setEntityData<{ message: string }>("athletes", athlete),
			representative && typeof representative === "object"
				? setEntityData<{ message: string }>("representatives", {
						...representative,
						user_id: {
							...representative.user_id,
							...(tutor === "representative"
								? {
										password: password,
										restore_code: restore_code,
									}
								: {}),
						},
					})
				: undefined,
			mother && typeof mother === "object"
				? setEntityData<{ message: string }>("representatives", {
						...mother,
						user_id: {
							...mother.user_id,
							...(tutor === "mother"
								? {
										password: password,
										restore_code: restore_code,
									}
								: {}),
						},
					})
				: undefined,
			father && typeof father === "object"
				? setEntityData<{ message: string }>("representatives", {
						...father,
						user_id: {
							...father.user_id,
							...(tutor === "father"
								? {
										password: password,
										restore_code: restore_code,
									}
								: {}),
						},
					})
				: undefined,
		]);

		const [_, repAthlete, motherAthlete, fatherAthlete] = await Promise.all<
			{ message: string } | undefined
		>([
			setEntityData("health", {
				...healthData,
				athlete_id: athleteId?.message,
			}),
			reprId ||
			(typeof representative === "string" &&
				representative.match(regexList.forDNI))
				? setEntityData("repr-athletes", {
						athlete_id: athleteId?.message,
						representative_id: reprId?.message ?? (representative as string),
						relation: "representante",
						tutor: tutor === "representative",
					})
				: undefined,
			motherId || (typeof mother === "string" && mother.match(regexList.forDNI))
				? setEntityData("repr-athletes", {
						athlete_id: athleteId,
						representative_id: motherId?.message ?? (mother as string),
						relation: "madre",
						tutor: tutor === "mother",
					})
				: undefined,
			fatherId || (typeof father === "string" && father.match(regexList.forDNI))
				? setEntityData("repr-athletes", {
						athlete_id: athleteId,
						representative_id: fatherId?.message ?? (father as string),
						relation: "padre",
						tutor: tutor === "father",
					})
				: undefined,
		]);

		return {
			props: {
				name:
					tutor === "representative"
						? (representative as Representative).user_id.name
						: tutor === "mother"
							? (mother as Representative).user_id.name
							: (father as Representative).user_id.name,
				password,
				restore_code,
			},
			athleteId: athleteId?.message,
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
 */
	return await db.transaction(async (tx) => {
		// Insert the user-athlete to athlete table
		const [{ id: athUserId }] = await tx
			.insert(users)
			.values({ ...athlete.user_id, role: "atleta" })
			.returning({ id: users.id });

		// Insert the user-representative to representative table
		const [{ id: reprUserId }] =
			representative && typeof representative === "object"
				? await tx
						.insert(users)
						.values({
							...representative.user_id,
							role: "representante",
							...(tutor === "representative"
								? {
										password: await bcrypt.hash(password, 10),
										restore_code: await bcrypt.hash(restore_code, 10),
									}
								: {}),
						})
						.returning({ id: users.id })
				: [{ id: undefined }];

		// Insert the user-mother to representative table
		const [{ id: motherUserId }] =
			mother && typeof mother === "object"
				? await tx
						.insert(users)
						.values({
							...mother.user_id,
							role: "representante",
							...(tutor === "mother"
								? {
										password: await bcrypt.hash(password, 10),
										restore_code: await bcrypt.hash(restore_code, 10),
									}
								: {}),
						})
						.returning({ id: users.id })
				: [{ id: undefined }];

		// Insert the user-father to representative table
		const [{ id: fatherUserId }] =
			father && typeof father === "object"
				? await tx
						.insert(users)
						.values({
							...father.user_id,
							role: "representante",
							...(tutor === "father"
								? {
										password: await bcrypt.hash(password, 10),
										restore_code: await bcrypt.hash(restore_code, 10),
									}
								: {}),
						})
						.returning({ id: users.id })
				: [{ id: undefined }];

		// Insert the representative to representative table
		const [{ id: reprId }] =
			reprUserId && typeof representative === "object"
				? await tx
						.insert(representatives)
						.values({
							...representative,
							user_id: reprUserId,
						})
						.returning({ id: representatives.id })
				: typeof representative === "string" &&
						representative.match(regexList.forDNI)
					? await tx
							.select({ id: representatives.id })
							.from(representatives)
							.innerJoin(users, eq(representatives.user_id, users.id))
							.where(eq(users.ci_number, representative))
					: [{ id: undefined }];

		// Insert the mother to representative table
		const [{ id: motherId }] =
			motherUserId && typeof mother === "object"
				? await tx
						.insert(representatives)
						.values({
							...mother,
							user_id: motherUserId,
						})
						.returning({ id: representatives.id })
				: typeof mother === "string" && mother.match(regexList.forDNI)
					? await tx
							.select({ id: representatives.id })
							.from(representatives)
							.innerJoin(users, eq(representatives.user_id, users.id))
							.where(eq(users.ci_number, mother))
					: [{ id: undefined }];

		// Insert the father to representative table
		const [{ id: fatherId }] =
			fatherUserId && typeof father === "object"
				? await tx
						.insert(representatives)
						.values({
							...father,
							user_id: fatherUserId,
						})
						.returning({ id: representatives.id })
				: typeof father === "string" && father.match(regexList.forDNI)
					? await tx
							.select({ id: representatives.id })
							.from(representatives)
							.innerJoin(users, eq(representatives.user_id, users.id))
							.where(eq(users.ci_number, father))
					: [{ id: undefined }];

		// Insert the athlete to athlete table
		const [{ id: athleteId }] = await tx
			.insert(athletes)
			.values({
				...athlete,
				user_id: athUserId,
			})
			.returning({ id: athletes.id });

		await tx
			.insert(health)
			.values({
				...healthData,
				athlete_id: athleteId,
			})
			.returning({ id: health.id });

		reprId &&
			(await tx.insert(athletes_representatives).values({
				athlete_id: athleteId,
				representative_id: reprId,
				relation: "representante",
				tutor: tutor === "representative",
			}));

		motherId &&
			(await tx.insert(athletes_representatives).values({
				athlete_id: athleteId,
				representative_id: motherId,
				relation: "madre",
				tutor: tutor === "mother",
			}));

		fatherId &&
			(await tx.insert(athletes_representatives).values({
				athlete_id: athleteId,
				representative_id: fatherId,
				relation: "padre",
				tutor: tutor === "father",
			}));

		return {
			props: {
				name:
					tutor === "representative"
						? (representative as Representative).user_id.name
						: tutor === "mother"
							? (mother as Representative).user_id.name
							: (father as Representative).user_id.name,
				password,
				restore_code,
			},
			athleteId,
		};
	});
};

interface HistoryData {
	user_id: string;
	description?: string;
	action: (typeof historyTypes.enumValues)[number];
	reference_id?: string | null;
}

export const insertHistory = async (data: HistoryData) =>
	await db.insert(history).values(data);
