CREATE TYPE "public"."history_types" AS ENUM('MODIFICO', 'CREO', 'ELIMINO', 'PAGO', 'INICIO SESION', 'CERRO SESION');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('representante', 'secretaria', 'administrador', 'atleta');--> statement-breakpoint
CREATE TABLE "athletes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"birth_date" date NOT NULL,
	"age" integer NOT NULL,
	"birth_place" text NOT NULL,
	"address" text NOT NULL,
	"solvent" integer DEFAULT 0 NOT NULL,
	"category" text,
	"position" text,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "athletes_representatives" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"athlete_id" uuid NOT NULL,
	"representative_id" uuid NOT NULL,
	"relation" text DEFAULT 'representante' NOT NULL,
	"tutor" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "configurations" (
	"id" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"athlete_id" uuid NOT NULL,
	"medical_authorization" boolean DEFAULT false,
	"blood_type" text NOT NULL,
	"has_allergies" text,
	"takes_medications" text,
	"surgical_intervention" text,
	"injuries" text,
	"current_illnesses" text,
	"has_asthma" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "history" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"description" text,
	"action" "history_types" NOT NULL,
	"reference_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"representative_id" uuid NOT NULL,
	"payment_date" date DEFAULT now(),
	"description" text,
	"athlete_id" uuid NOT NULL,
	"image_path" text
);
--> statement-breakpoint
CREATE TABLE "representatives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"occupation" text NOT NULL,
	"height" integer,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"lastname" text NOT NULL,
	"ci_number" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"role" "roles" DEFAULT 'representante' NOT NULL,
	"image" text,
	"password" text,
	"restore_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "atletas_usuario_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athletes_representatives" ADD CONSTRAINT "atletas_representantes_atleta_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athletes_representatives" ADD CONSTRAINT "atletas_representantes_representante_id_fkey" FOREIGN KEY ("representative_id") REFERENCES "public"."representatives"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health" ADD CONSTRAINT "salud_atletas_atleta_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "facturas_atleta_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "facturas_representante_id_fkey" FOREIGN KEY ("representative_id") REFERENCES "public"."representatives"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "representatives" ADD CONSTRAINT "representantes_usuario_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "public_atletas_pkey" ON "athletes" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_atletas_usuario_id_key" ON "athletes" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "public_idx_solvente" ON "athletes" USING btree ("solvent" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_atletas_representantes_pkey" ON "athletes_representatives" USING btree ("id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_health_pkey" ON "health" USING btree ("id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_unique_atleta_id" ON "health" USING btree ("athlete_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "public_idx_user_id" ON "history" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_facturas_pkey" ON "invoices" USING btree ("id" int8_ops);--> statement-breakpoint
CREATE INDEX "public_idx_fecha_pago" ON "invoices" USING btree ("payment_date" date_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_representantes_pkey" ON "representatives" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_representantes_usuario_id_key" ON "representatives" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ci_number_pkey" ON "users" USING btree ("ci_number" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "email_pkey" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "public_users_pkey" ON "users" USING btree ("id" uuid_ops);