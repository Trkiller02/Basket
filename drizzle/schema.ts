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
		user_id: text().notNull(),
	},
	(table) => [
		uniqueIndex("public_atletas_pkey").using(
			"btree",
			table.id.asc().nullsLast().op("uuid_ops"),
		),
		uniqueIndex("public_atletas_usuario_id_key").using(
			"btree",
			table.user_id.asc().nullsLast().op("text_ops"),
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
		id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
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

export const representatives = pgTable(
	"representatives",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		occupation: text().notNull(),
		height: numeric({ precision: 4, scale: 2 }),
		user_id: text().notNull(),
	},
	(table) => [
		uniqueIndex("public_representantes_pkey").using(
			"btree",
			table.id.asc().nullsLast().op("uuid_ops"),
		),
		uniqueIndex("public_representantes_usuario_id_key").using(
			"btree",
			table.user_id.asc().nullsLast().op("text_ops"),
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
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: boolean("email_verified").notNull().default(false),
		image: text("image"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
		deleted_at: timestamp("deleted_at"),
		twoFactorEnabled: boolean("two_factor_enabled").default(false),
		restore_code: text("restore_code"),
		role: text("role"),
		banned: boolean("banned"),
		banReason: text("ban_reason"),
		banExpires: timestamp("ban_expires"),
		lastname: text("lastname").notNull(),
		ci_number: text("ci_number").notNull(),
		phone_number: text("phone_number"),
	},
	(table) => [
		uniqueIndex("ci_number_pkey").using(
			"btree",
			table.id.asc().nullsLast().op("text_ops"),
		),
	],
);

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	impersonatedBy: text("impersonated_by"),
});

export const accounts = pgTable("accounts", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

export const twoFactors = pgTable("two_factors", {
	id: text("id").primaryKey(),
	secret: text("secret").notNull(),
	backupCodes: text("backup_codes").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});

export const configurations = pgTable("configurations", {
	id: text("id").primaryKey(),
	value: text("value").notNull(),
});

export const notifications = pgTable("notifications", {
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
		name: "notifications_id_seq",
		startWith: 1,
		increment: 1,
		minValue: 1,
		cache: 1,
	}),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id),
	description: text("description"),
	type: text("type").notNull(),
	reference_id: text("reference_id"),
	created_at: timestamp("created_at").defaultNow(),
});
