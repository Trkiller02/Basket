import { relations } from "drizzle-orm/relations";
import {
	users,
	athletes,
	health,
	athletes_representatives,
	representatives,
	invoices,
} from "./schema";

export const athletesRelations = relations(athletes, ({ one, many }) => ({
	user: one(users, {
		fields: [athletes.user_id],
		references: [users.id],
	}),
	health: many(health),
	athletes_representatives: many(athletes_representatives),
	invoices: many(invoices),
}));

export const usersRelations = relations(users, ({ many }) => ({
	athletes: many(athletes),
	representatives: many(representatives),
}));

export const healthRelations = relations(health, ({ one }) => ({
	athlete: one(athletes, {
		fields: [health.athlete_id],
		references: [athletes.id],
	}),
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
