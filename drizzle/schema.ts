import {
	pgTable,
	uniqueIndex,
	index,
	foreignKey,
	unique,
	uuid,
	date,
	integer,
	text,
	boolean,
	bigint,
	numeric,
	timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const athletes = pgTable(
	"athletes",
	{
		id: uuid().primaryKey().defaultRandom(),
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
			table.solvent.asc().nullsLast(),
		),
		foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.id],
			name: "atletas_usuario_id_fkey",
		}),
		unique("athletes_user_id_key").on(table.user_id),
	],
);

export const athletes_representatives = pgTable(
	"athletes_representatives",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
		athlete_id: uuid().notNull(),
		representative_id: uuid().notNull(),
		relation: text().notNull().default("representante"),
		tutor: boolean().notNull().default(true),
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
		id: uuid().primaryKey().defaultRandom(),
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

export const invoices = pgTable(
	"invoices",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
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

export const athletes_health = pgTable(
	"athletes_health",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
		athlete_id: uuid().notNull(),
		medical_authorization: boolean().notNull(),
		blood_type: text().notNull(),
		has_allergies: boolean().notNull(),
		takes_medications: boolean().notNull(),
		surgical_intervention: boolean().notNull(),
		injuries: boolean().notNull(),
		current_illnesses: text(),
		has_asthma: boolean().notNull(),
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

export const users = pgTable(
	"users",
	{
		id: uuid().primaryKey().defaultRandom(),
		name: text().notNull(),
		lastname: text().notNull(),
		ci_number: text().notNull(),
		phone_number: text(),
		email: text(),
		role: text(),
		email_verified: boolean().notNull().default(false),
		created_at: timestamp({ mode: "string" }).notNull().defaultNow(),
		updated_at: timestamp({ mode: "string" })
			.notNull()
			.defaultNow()
			.$onUpdate(() => sql`NOW()`),
		deleted_at: timestamp({ mode: "string" }),
		two_factor_enabled: boolean(),
		banned: boolean(),
		ban_reason: text(),
		ban_expires: timestamp({ mode: "string" }),
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

export const accounts = pgTable(
	"accounts",
	{
		id: text().primaryKey().notNull(),
		account_id: text().notNull(),
		provider_id: text().notNull(),
		user_id: uuid().notNull(),
		access_token: text(),
		refresh_token: text(),
		id_token: text(),
		access_token_expires_at: timestamp({ mode: "string" }),
		refresh_token_expires_at: timestamp({ mode: "string" }),
		scope: text(),
		password: text(),
		created_at: timestamp({ mode: "string" }).notNull(),
		updated_at: timestamp({ mode: "string" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk",
		}).onDelete("cascade"),
	],
);

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expires_at: timestamp({ mode: "string" }).notNull(),
	created_at: timestamp({ mode: "string" }),
	updated_at: timestamp({ mode: "string" }),
});

export const two_factors = pgTable(
	"two_factors",
	{
		id: text().primaryKey().notNull(),
		secret: text().notNull(),
		backup_codes: text().notNull(),
		user_id: uuid().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.id],
			name: "two_factors_user_id_users_id_fk",
		}).onDelete("cascade"),
	],
);

export const sessions = pgTable(
	"sessions",
	{
		id: text().primaryKey().notNull(),
		expires_at: timestamp({ mode: "string" }).notNull(),
		token: text().notNull(),
		created_at: timestamp({ mode: "string" }).notNull(),
		updated_at: timestamp({ mode: "string" }).notNull(),
		ip_address: text(),
		user_agent: text(),
		user_id: uuid().notNull(),
		impersonated_by: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk",
		}).onDelete("cascade"),
		unique("sessions_token_unique").on(table.token),
	],
);
