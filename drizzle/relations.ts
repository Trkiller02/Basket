import { relations } from "drizzle-orm/relations";
import { athletes, athletes_representatives, representatives, health, users, notifications, invoices } from "./schema";

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

export const athletesRelations = relations(athletes, ({one, many}) => ({
	athletes_representatives: many(athletes_representatives),
	health: many(health),
	invoices: many(invoices),
	user: one(users, {
		fields: [athletes.user_id],
		references: [users.id]
	}),
}));

export const representativesRelations = relations(representatives, ({one, many}) => ({
	athletes_representatives: many(athletes_representatives),
	invoices: many(invoices),
	user: one(users, {
		fields: [representatives.user_id],
		references: [users.id]
	}),
}));

export const healthRelations = relations(health, ({one}) => ({
	athlete: one(athletes, {
		fields: [health.athlete_id],
		references: [athletes.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.user_id],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	notifications: many(notifications),
	athletes: many(athletes),
	representatives: many(representatives),
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