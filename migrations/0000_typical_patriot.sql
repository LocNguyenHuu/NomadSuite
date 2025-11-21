CREATE TYPE "public"."audit_action_enum" AS ENUM('upload', 'download_link', 'download', 'delete', 'user_delete', 'auto_delete', 'expiry_notice', 'erasure_request');--> statement-breakpoint
CREATE TYPE "public"."job_type_enum" AS ENUM('retention_delete', 'expiry_alert_30d', 'expiry_alert_7d');--> statement-breakpoint
CREATE TYPE "public"."retention_policy_enum" AS ENUM('on_expiry', 'after_upload', 'indefinite');--> statement-breakpoint
CREATE TYPE "public"."storage_region_enum" AS ENUM('EU');--> statement-breakpoint
CREATE TABLE "client_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"type" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"country" text NOT NULL,
	"status" text NOT NULL,
	"notes" text,
	"last_interaction_date" timestamp,
	"next_action_date" timestamp,
	"next_action_description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "document_retention_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"due_at" timestamp NOT NULL,
	"job_type" "job_type_enum" NOT NULL,
	"executed" boolean DEFAULT false,
	"executed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"expiry_date" timestamp,
	"file_url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invoice_counters" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"year" integer NOT NULL,
	"counter" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "invoice_counters_user_id_year_unique" UNIQUE("user_id","year")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"client_id" integer NOT NULL,
	"invoice_number" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" text NOT NULL,
	"due_date" timestamp NOT NULL,
	"issued_at" timestamp DEFAULT now(),
	"items" jsonb NOT NULL,
	"tax" integer DEFAULT 0,
	"notes_to_client" text,
	"country" text,
	"language" text DEFAULT 'en',
	"exchange_rate" text,
	"customer_vat_id" text,
	"reverse_charge" boolean DEFAULT false,
	"reverse_charge_note" text,
	"compliance_checked" boolean DEFAULT false,
	"template_version" text DEFAULT 'standard'
);
--> statement-breakpoint
CREATE TABLE "jurisdiction_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"country" text NOT NULL,
	"country_name" text NOT NULL,
	"supported_languages" text[] NOT NULL,
	"default_language" text NOT NULL,
	"default_currency" text NOT NULL,
	"requires_vat_id" boolean DEFAULT false,
	"requires_customer_vat_id" boolean DEFAULT false,
	"supports_reverse_charge" boolean DEFAULT false,
	"archiving_years" integer DEFAULT 7,
	"tax_rate" text,
	"language_note" text,
	"compliance_notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "jurisdiction_rules_country_unique" UNIQUE("country")
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"country" text NOT NULL,
	"entry_date" timestamp NOT NULL,
	"exit_date" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"home_country" text DEFAULT 'USA',
	"current_country" text DEFAULT 'Japan',
	"role" text DEFAULT 'user' NOT NULL,
	"business_name" text,
	"business_address" text,
	"vat_id" text,
	"tax_regime" text,
	"bank_name" text,
	"account_number" text,
	"iban" text,
	"swift" text,
	"primary_language" text DEFAULT 'en',
	"default_currency" text DEFAULT 'USD',
	"default_invoice_language" text DEFAULT 'en',
	"timezone" text DEFAULT 'UTC',
	"date_format" text DEFAULT 'MM/DD/YYYY',
	"invoice_prefix" text DEFAULT 'NS-',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "vault_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"document_id" integer,
	"action" "audit_action_enum" NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vault_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"workspace_id" integer NOT NULL,
	"encrypted_metadata" jsonb NOT NULL,
	"storage_key" text NOT NULL,
	"file_hash" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" text NOT NULL,
	"storage_region" "storage_region_enum" DEFAULT 'EU' NOT NULL,
	"retention_policy" "retention_policy_enum" DEFAULT 'indefinite' NOT NULL,
	"retention_months" integer,
	"expiry_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"hard_delete_at" timestamp,
	CONSTRAINT "retention_months_check" CHECK ("vault_documents"."retention_months" IS NULL OR ("vault_documents"."retention_months" > 0 AND "vault_documents"."retention_months" <= 120)),
	CONSTRAINT "hard_delete_check" CHECK ("vault_documents"."hard_delete_at" IS NULL OR "vault_documents"."hard_delete_at" <= "vault_documents"."created_at" + INTERVAL '10 years')
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"default_currency" text DEFAULT 'USD' NOT NULL,
	"default_tax_country" text DEFAULT 'USA',
	"plan" text DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "client_notes" ADD CONSTRAINT "client_notes_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_notes" ADD CONSTRAINT "client_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_retention_jobs" ADD CONSTRAINT "document_retention_jobs_document_id_vault_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."vault_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_counters" ADD CONSTRAINT "invoice_counters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_audit_logs" ADD CONSTRAINT "vault_audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_audit_logs" ADD CONSTRAINT "vault_audit_logs_document_id_vault_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."vault_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_documents" ADD CONSTRAINT "vault_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_documents" ADD CONSTRAINT "vault_documents_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;