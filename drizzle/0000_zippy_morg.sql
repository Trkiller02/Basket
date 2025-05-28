-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "athletes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"birth_date" date NOT NULL,
	"age" integer NOT NULL,
	"birth_place" text NOT NULL,
	"address" text NOT NULL,
	"solvent" boolean DEFAULT true NOT NULL,
	"user_id" uuid,
	CONSTRAINT "athletes_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "athletes_representatives" (
	"id" bigint PRIMARY KEY NOT NULL,
	"athlete_id" uuid NOT NULL,
	"representative_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "representatives" (
	"id" uuid PRIMARY KEY NOT NULL,
	"occupation" text NOT NULL,
	"height" numeric(4, 2),
	"user_id" uuid,
	CONSTRAINT "representatives_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lastname" text NOT NULL,
	"ci_number" text NOT NULL,
	"phone_number" text,
	"password" text,
	"role" text,
	CONSTRAINT "users_ci_number_key" UNIQUE("ci_number")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" bigint PRIMARY KEY NOT NULL,
	"representative_id" uuid NOT NULL,
	"payment_date" date NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"description" text,
	"athlete_id" uuid NOT NULL,
	"image_path" text
);
--> statement-breakpoint
CREATE TABLE "athletes_health" (
	"id" bigint PRIMARY KEY NOT NULL,
	"athlete_id" uuid NOT NULL,
	"medical_authorization" boolean NOT NULL,
	"blood_type" text NOT NULL,
	"has_allergies" boolean NOT NULL,
	"takes_medications" boolean NOT NULL,
	"surgical_intervention" boolean NOT NULL,
	"injuries" boolean NOT NULL,
	"current_illnesses" text,
	"has_asthma" boolean NOT NULL,
	CONSTRAINT "athletes_health_athlete_id_key" UNIQUE("athlete_id")
);
--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "atletas_usuario_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athletes_representatives" ADD CONSTRAINT "atletas_representantes_atleta_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athletes_representatives" ADD CONSTRAINT "atletas_representantes_representante_id_fkey" FOREIGN KEY ("representative_id") REFERENCES "public"."representatives"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "representatives" ADD CONSTRAINT "representantes_usuario_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "facturas_atleta_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "facturas_representante_id_fkey" FOREIGN KEY ("representative_id") REFERENCES "public"."representatives"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athletes_health" ADD CONSTRAINT "salud_atletas_atleta_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "public_atletas_pkey" ON "athletes" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_atletas_usuario_id_key" ON "athletes" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "public_idx_solvente" ON "athletes" USING btree ("solvent" bool_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_atletas_representantes_pkey" ON "athletes_representatives" USING btree ("id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_representantes_pkey" ON "representatives" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_representantes_usuario_id_key" ON "representatives" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_usuarios_ci_number_key" ON "users" USING btree ("ci_number" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_usuarios_pkey" ON "users" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_facturas_pkey" ON "invoices" USING btree ("id" int8_ops);--> statement-breakpoint
CREATE INDEX "public_idx_fecha_pago" ON "invoices" USING btree ("payment_date" date_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_salud_atletas_pkey" ON "athletes_health" USING btree ("id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_unique_atleta_id" ON "athletes_health" USING btree ("athlete_id" uuid_ops);
*/