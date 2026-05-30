CREATE TABLE "abandoned_lead" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"flow" text NOT NULL,
	"model_slug" text,
	"completed" boolean DEFAULT false NOT NULL,
	"recovery_sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_email" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"preheader" text DEFAULT '' NOT NULL,
	"html" text NOT NULL,
	"editor_json" jsonb,
	"created_by_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_template" (
	"key" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"preheader" text DEFAULT '' NOT NULL,
	"html" text NOT NULL,
	"editor_json" jsonb,
	"updated_by_name" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_template_version" (
	"id" text PRIMARY KEY NOT NULL,
	"template_key" text NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"preheader" text DEFAULT '' NOT NULL,
	"html" text NOT NULL,
	"editor_json" jsonb,
	"edited_by_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "abandoned_email_flow_idx" ON "abandoned_lead" USING btree ("email","flow");--> statement-breakpoint
CREATE INDEX "email_version_key_idx" ON "email_template_version" USING btree ("template_key");