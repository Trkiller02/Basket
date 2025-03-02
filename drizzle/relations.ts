import { relations } from "drizzle-orm/relations";
import {
	users,
	athletes,
	athletes_representatives,
	representatives,
	invoices,
	athletes_health,
	accounts,
	two_factors,
	sessions,
} from "./schema";

export const athletesRelations = relations(athletes, ({ one, many }) => ({
	user: one(users, {
		fields: [athletes.user_id],
		references: [users.id],
	}),
	athletes_representatives: many(athletes_representatives),
	invoices: many(invoices),
	athletes_healths: many(athletes_health),
}));

export const usersRelations = relations(users, ({ many }) => ({
	athletes: many(athletes),
	representatives: many(representatives),
	accounts: many(accounts),
	two_factors: many(two_factors),
	sessions: many(sessions),
}));

export const athletes_representativesRelations = relations(
	athletes_representatives,
	({ one }) => ({
		athlete: one(athletes, {
			fields: [athletes_representatives.athlete_id],
			references: [athletes.id],
		}),
		representative: one(representatives, {
			fields: [athletes_representatives.representative_id],
			references: [representatives.id],
		}),
	}),
);

export const representativesRelations = relations(
	representatives,
	({ one, many }) => ({
		athletes_representatives: many(athletes_representatives),
		user: one(users, {
			fields: [representatives.user_id],
			references: [users.id],
		}),
		invoices: many(invoices),
	}),
);

export const invoicesRelations = relations(invoices, ({ one }) => ({
	athlete: one(athletes, {
		fields: [invoices.athlete_id],
		references: [athletes.id],
	}),
	representative: one(representatives, {
		fields: [invoices.representative_id],
		references: [representatives.id],
	}),
}));

export const athletes_healthRelations = relations(
	athletes_health,
	({ one }) => ({
		athlete: one(athletes, {
			fields: [athletes_health.athlete_id],
			references: [athletes.id],
		}),
	}),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.user_id],
		references: [users.id],
	}),
}));

export const two_factorsRelations = relations(two_factors, ({ one }) => ({
	user: one(users, {
		fields: [two_factors.user_id],
		references: [users.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.user_id],
		references: [users.id],
	}),
}));
