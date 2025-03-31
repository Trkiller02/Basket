import {
	pgTable,
	uniqueIndex,
	index,
	foreignKey,
	unique,
	uuid,
	text,
	date,
	integer,
	bigint,
	boolean,
	numeric,
	timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const athletes = pgTable(
	"athletes",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		image: text(),
		birth_date: date().notNull(),
		age: integer().notNull(),
		birth_place: text().notNull(),
		address: text().notNull(),
		solvent: integer().default(0).notNull(),
		category: text(),
		position: text(),
		user_id: uuid(),
	},
	(table) => [
		uniqueIndex("public_atletas_pkey").using(
			"btree",
			table.id.asc().nullsLast().op("uuid_ops"),
		),
		uniqueIndex("public_atletas_usuario_id_key").using(
			"btree",
			table.user_id.asc().nullsLast().op("uuid_ops"),
		),
		index("public_idx_solvente").using(
			"btree",
			table.solvent.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.id],
			name: "atletas_usuario_id_fkey",
		}),
		unique("athletes_user_id_key").on(table.user_id),
	],
);

export const athletes_health = pgTable(
	"athletes_health",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" })
			.primaryKey()
			.generatedByDefaultAsIdentity({
				name: "athletes_health_id_seq",
				startWith: 1,
				increment: 1,
				minValue: 1,
				cache: 1,
			}),
		athlete_id: uuid().notNull(),
		medical_authorization: boolean().default(false),
		blood_type: text().notNull(),
		has_allergies: text(),
		takes_medications: text(),
		surgical_intervention: text(),
		injuries: text(),
		current_illnesses: text(),
		has_asthma: boolean().default(false),
	},
	(table) => [
		uniqueIndex("public_salud_atletas_pkey").using(
			"btree",
			table.id.asc().nullsLast().op("int8_ops"),
		),
		uniqueIndex("public_unique_atleta_id").using(
			"btree",
			table.athlete_id.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.athlete_id],
			foreignColumns: [athletes.id],
			name: "salud_atletas_atleta_id_fkey",
		}),
		unique("athletes_health_athlete_id_key").on(table.athlete_id),
	],
);

export const athletes_representatives = pgTable(
	"athletes_representatives",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" })
			.primaryKey()
			.generatedByDefaultAsIdentity({
				name: "athletes_representatives_id_seq",
				startWith: 1,
				increment: 1,
				minValue: 1,
				cache: 1,
			}),
		athlete_id: uuid().notNull(),
		representative_id: uuid().notNull(),
		relation: text().default("representante").notNull(),
		tutor: boolean().default(true).notNull(),
	},
	(table) => [
		uniqueIndex("public_atletas_representantes_pkey").using(
			"btree",
			table.id.asc().nullsLast().op("int8_ops"),
		),
		foreignKey({
			columns: [table.athlete_id],
			foreignColumns: [athletes.id],
			name: "atletas_representantes_atleta_id_fkey",
		}),
		foreignKey({
			columns: [table.representative_id],
			foreignColumns: [representatives.id],
			name: "atletas_representantes_representante_id_fkey",
		}),
	],
);

export const representatives = pgTable(
	"representatives",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		occupation: text().notNull(),
		height: numeric({ precision: 4, scale: 2 }),
		user_id: uuid(),
	},
	(table) => [
		uniqueIndex("public_representantes_pkey").using(
			"btree",
			table.id.asc().nullsLast().op("uuid_ops"),
		),
		uniqueIndex("public_representantes_usuario_id_key").using(
			"btree",
			table.user_id.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.id],
			name: "representantes_usuario_id_fkey",
		}),
		unique("representatives_user_id_key").on(table.user_id),
	],
);

export const sessions = pgTable(
	"sessions",
	{
		id: text().primaryKey().notNull(),
		expiresAt: timestamp({ mode: "string" }).notNull(),
		token: text().notNull(),
		createdAt: timestamp({ mode: "string" }).notNull(),
		updatedAt: timestamp({ mode: "string" }).notNull(),
		ipAddress: text(),
		userAgent: text(),
		userId: uuid().notNull(),
		impersonatedBy: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk",
		}).onDelete("cascade"),
		unique("sessions_token_unique").on(table.token),
	],
);

export const invoices = pgTable(
	"invoices",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" })
			.primaryKey()
			.generatedByDefaultAsIdentity({
				name: "invoices_id_seq",
				startWith: 1,
				increment: 1,
				minValue: 1,
				cache: 1,
			}),
		representative_id: uuid().notNull(),
		payment_date: date().defaultNow(),
		amount: numeric({ precision: 10, scale: 2 }).notNull(),
		description: text(),
		athlete_id: uuid().notNull(),
		image_path: text(),
	},
	(table) => [
		uniqueIndex("public_facturas_pkey").using(
			"btree",
			table.id.asc().nullsLast().op("int8_ops"),
		),
		index("public_idx_fecha_pago").using(
			"btree",
			table.payment_date.asc().nullsLast().op("date_ops"),
		),
		foreignKey({
			columns: [table.athlete_id],
			foreignColumns: [athletes.id],
			name: "facturas_atleta_id_fkey",
		}),
		foreignKey({
			columns: [table.representative_id],
			foreignColumns: [representatives.id],
			name: "facturas_representante_id_fkey",
		}),
	],
);

export const two_factors = pgTable(
	"two_factors",
	{
		id: text().primaryKey().notNull(),
		secret: text().notNull(),
		backupCodes: text().notNull(),
		userId: uuid().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "two_factors_user_id_users_id_fk",
		}).onDelete("cascade"),
	],
);

export const accounts = pgTable(
	"accounts",
	{
		id: text().primaryKey().notNull(),
		accountId: text().notNull(),
		providerId: text().notNull(),
		userId: uuid().notNull(),
		accessToken: text(),
		refreshToken: text(),
		idToken: text(),
		accessTokenExpiresAt: timestamp({ mode: "string" }),
		refreshTokenExpiresAt: timestamp({ mode: "string" }),
		scope: text(),
		password: text(),
		createdAt: timestamp({ mode: "string" }).notNull(),
		updatedAt: timestamp({ mode: "string" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk",
		}).onDelete("cascade"),
	],
);

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp({ mode: "string" }).notNull(),
	createdAt: timestamp({ mode: "string" }),
	updatedAt: timestamp({ mode: "string" }),
});

export const users = pgTable(
	"users",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		lastname: text().notNull(),
		ci_number: text().notNull(),
		phone_number: text(),
		email: text(),
		role: text(),
		emailVerified: boolean().default(false).notNull(),
		createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
		deleted_at: timestamp({ mode: "string" }),
		twoFactorEnabled: boolean(),
		banned: boolean(),
		banReason: text(),
		banExpires: timestamp({ mode: "string" }),
	},
	(table) => [
		uniqueIndex("public_usuarios_ci_number_key").using(
			"btree",
			table.ci_number.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("public_usuarios_pkey").using(
			"btree",
			table.id.asc().nullsLast().op("uuid_ops"),
		),
		unique("users_ci_number_key").on(table.ci_number),
		unique("users_email_unique").on(table.email),
	],
);
