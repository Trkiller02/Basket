import { relations } from "drizzle-orm/relations";
import { users, athletes, athletes_health, athletes_representatives, representatives, sessions, invoices, two_factors, accounts } from "./schema";

export const athletesRelations = relations(athletes, ({one, many}) => ({
	user: one(users, {
		fields: [athletes.user_id],
		references: [users.id]
	}),
	athletes_healths: many(athletes_health),
	athletes_representatives: many(athletes_representatives),
	invoices: many(invoices),
}));

export const usersRelations = relations(users, ({many}) => ({
	athletes: many(athletes),
	representatives: many(representatives),
	sessions: many(sessions),
	two_factors: many(two_factors),
	accounts: many(accounts),
}));

export const athletes_healthRelations = relations(athletes_health, ({one}) => ({
	athlete: one(athletes, {
		fields: [athletes_health.athlete_id],
		references: [athletes.id]
	}),
}));

export const athletes_representativesRelations = relations(athletes_representatives, ({one}) => ({
	athlete: one(athletes, {
		fields: [athletes_representatives.athlete_id],
		references: [athletes.id]
	}),
	representative: one(representatives, {
		fields: [athletes_representatives.representative_id],
		references: [representatives.id]
	}),
}));

export const representativesRelations = relations(representatives, ({one, many}) => ({
	athletes_representatives: many(athletes_representatives),
	user: one(users, {
		fields: [representatives.user_id],
		references: [users.id]
	}),
	invoices: many(invoices),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const invoicesRelations = relations(invoices, ({one}) => ({
	athlete: one(athletes, {
		fields: [invoices.athlete_id],
		references: [athletes.id]
	}),
	representative: one(representatives, {
		fields: [invoices.representative_id],
		references: [representatives.id]
	}),
}));

export const two_factorsRelations = relations(two_factors, ({one}) => ({
	user: one(users, {
		fields: [two_factors.userId],
		references: [users.id]
	}),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));