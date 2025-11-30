CREATE TYPE "public"."expense_category_enum" AS ENUM('Travel', 'Accommodation', 'Food & Dining', 'Transportation', 'Equipment', 'Software', 'Communication', 'Office Supplies', 'Professional Services', 'Insurance', 'Banking & Fees', 'Marketing', 'Education', 'Entertainment', 'Other');--> statement-breakpoint
CREATE TYPE "public"."feature_category_enum" AS ENUM('Invoicing', 'Clients/CRM', 'Travel Tracking', 'Visa/Tax Alerts', 'Documents', 'UI/UX', 'Integrations', 'Other');--> statement-breakpoint
CREATE TYPE "public"."feature_priority_enum" AS ENUM('Nice to have', 'Would use regularly', 'Critical for my workflow');--> statement-breakpoint
CREATE TYPE "public"."project_status_enum" AS ENUM('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."waitlist_role_enum" AS ENUM('Digital Nomad', 'Freelancer', 'Agency/Team', 'Other');--> statement-breakpoint
CREATE TYPE "public"."security_audit_action_enum" AS ENUM('login_success', 'login_failed', 'logout', 'password_change', 'password_reset_request', 'password_reset_complete', 'registration', 'session_invalidated', 'rate_limit_exceeded', 'invoice_created', 'invoice_updated', 'invoice_deleted', 'client_created', 'client_updated', 'client_deleted');--> statement-breakpoint
CREATE TYPE "public"."task_priority_enum" AS ENUM('Low', 'Medium', 'High', 'Urgent');--> statement-breakpoint
CREATE TYPE "public"."task_status_enum" AS ENUM('To Do', 'In Progress', 'Done', 'Cancelled');--> statement-breakpoint
CREATE TABLE "bug_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"description" text NOT NULL,
	"screenshot_url" text,
	"contact_consent" boolean DEFAULT false NOT NULL,
	"airtable_record_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"client_id" integer,
	"project_id" integer,
	"date" timestamp NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"category" "expense_category_enum" NOT NULL,
	"description" text,
	"receipt_url" text,
	"geo_latitude" text,
	"geo_longitude" text,
	"geo_place" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "feature_category_enum" NOT NULL,
	"priority" "feature_priority_enum",
	"contact_consent" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'New' NOT NULL,
	"airtable_record_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"client_id" integer,
	"name" text NOT NULL,
	"description" text,
	"status" "project_status_enum" DEFAULT 'Planning' NOT NULL,
	"budget" integer,
	"currency" text DEFAULT 'USD',
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "security_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" "security_audit_action_enum" NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "task_status_enum" DEFAULT 'To Do' NOT NULL,
	"priority" "task_priority_enum" DEFAULT 'Medium',
	"due_date" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"country" text,
	"role" "waitlist_role_enum" NOT NULL,
	"use_case" text,
	"referral_code" text,
	"email_consent" boolean DEFAULT true NOT NULL,
	"airtable_record_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "project_id" integer;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_audit_logs" ADD CONSTRAINT "security_audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;