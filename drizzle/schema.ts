import {
	pgTable,
	uniqueIndex,
	foreignKey,
	bigint,
	uuid,
	text,
	boolean,
	index,
	timestamp,
	date,
	integer,
	pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const roles = pgEnum("roles", [
	"representante",
	"secretaria",
	"administrador",
	"atleta",
]);

export const notificationsTypes = pgEnum("notifications_types", [
	"MODIFICO",
	"CREO",
	"ELIMINO",
	"PAGO",
	"INICIO SESION",
	"CERRO SESION",
]);

export const athletes_representatives = pgTable(
	"athletes_representatives",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
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

export const health = pgTable(
	"health",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
			name: "health_id_seq",
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
		uniqueIndex("public_health_pkey").using(
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
	],
);

export const configurations = pgTable("configurations", {
	id: text().primaryKey().notNull(),
	value: text().notNull(),
});

export const notifications = pgTable(
	"notifications",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
			name: "notifications_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			cache: 1,
		}),
		user_id: uuid().notNull(),
		description: text(),
		action_type: notificationsTypes("action_type").notNull(),
		reference_id: text(),
		created_at: timestamp({ mode: "string" }).defaultNow(),
	},
	(table) => [
		index("public_idx_user_id").using(
			"btree",
			table.user_id.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.id],
			name: "notifications_user_id_fkey",
		}),
	],
);

export const invoices = pgTable(
	"invoices",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
			name: "invoices_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			cache: 1,
		}),
		representative_id: uuid().notNull(),
		payment_date: date().defaultNow(),
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

export const users = pgTable(
	"users",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		lastname: text().notNull(),
		ci_number: text().notNull(),
		email: text().notNull(),
		phone_number: text(),
		role: roles().default("representante").notNull(),
		image: text(),
		password: text(),
		restore_code: text(),
		created_at: timestamp({ mode: "string" }).defaultNow().notNull(),
		updated_at: timestamp({ mode: "string" }).defaultNow().notNull(),
		deleted_at: timestamp({ mode: "string" }),
	},
	(table) => [
		uniqueIndex("ci_number_pkey").using(
			"btree",
			table.ci_number.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("email_pkey").using(
			"btree",
			table.email.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("public_users_pkey").using(
			"btree",
			table.id.asc().nullsLast().op("uuid_ops"),
		),
	],
);

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
		user_id: uuid().notNull(),
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
	],
);

export const representatives = pgTable(
	"representatives",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		occupation: text().notNull(),
		height: integer(),
		user_id: uuid().notNull(),
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
	],
);
